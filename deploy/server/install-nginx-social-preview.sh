#!/usr/bin/env bash
# Cài snippet nginx Open Graph cho spacedev.vn / dev.spacedev.vn
# An toàn: backup trước khi sửa, nginx -t trước reload, rollback nếu lỗi.
#
# Chạy trên VPS (sau getbuild hoặc deploy-prod):
#   cd /var/www/dev.spacedev.vn
#   sudo bash deploy/server/install-nginx-social-preview.sh
#
# Hoặc:
#   sudo DEV_ROOT=/var/www/dev.spacedev.vn PROD_ROOT=/var/www/spacedev.vn \
#     bash deploy/server/install-nginx-social-preview.sh

set -euo pipefail

DEV_ROOT="${DEV_ROOT:-/var/www/dev.spacedev.vn}"
PROD_ROOT="${PROD_ROOT:-/var/www/spacedev.vn}"
SNIPPETS_DIR="${SNIPPETS_DIR:-/etc/nginx/snippets}"
MAP_CONF="${MAP_CONF:-/etc/nginx/conf.d/00-spacedev-social-preview-map.conf}"
LOCATION_SNIPPET_NAME="spacedev-social-preview.conf"
BACKUP_DIR="/etc/nginx/.backup-social-preview-$(date +%Y%m%d-%H%M%S)"

if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
    echo "Chạy với sudo: sudo bash $0"
    exit 1
fi

log() { echo "[social-preview] $*"; }

find_deploy_dir() {
    local base
    for base in "$PROD_ROOT" "$DEV_ROOT"; do
        if [[ -f "$base/deploy/nginx-social-preview-map.conf" ]]; then
            echo "$base/deploy"
            return 0
        fi
    done
    return 1
}

DEPLOY_SRC="$(find_deploy_dir || true)"
if [[ -z "$DEPLOY_SRC" ]]; then
    echo "Không tìm thấy deploy/nginx-social-preview-map.conf"
    echo "  Đã kiểm tra: $PROD_ROOT/deploy và $DEV_ROOT/deploy"
    echo "  → Chạy getbuild.sh (frontend mới) hoặc deploy-prod trước."
    exit 1
fi

log "Nguồn snippet: $DEPLOY_SRC"

mkdir -p "$BACKUP_DIR" "$SNIPPETS_DIR"

cp -a "$DEPLOY_SRC/nginx-social-preview-map.conf" "$MAP_CONF"
cp -a "$DEPLOY_SRC/nginx-social-preview.conf" "$SNIPPETS_DIR/$LOCATION_SNIPPET_NAME"
log "Đã copy map → $MAP_CONF"
log "Đã copy location → $SNIPPETS_DIR/$LOCATION_SNIPPET_NAME"

INCLUDE_LINE="include ${SNIPPETS_DIR}/${LOCATION_SNIPPET_NAME};"

find_site_configs() {
    local paths=()
    local f
    # Chỉ frontend: spacedev.vn, www.spacedev.vn, dev.spacedev.vn (không match api.spacedev.vn)
    local name_pattern='server_name[^;]*\b(dev\.spacedev\.vn|www\.spacedev\.vn|spacedev\.vn)\b'
    for f in /etc/nginx/sites-enabled/* /etc/nginx/conf.d/*.conf; do
        [[ -f "$f" ]] || continue
        if grep -qE "$name_pattern" "$f" 2>/dev/null; then
            paths+=("$f")
        fi
    done
    if [[ ${#paths[@]} -eq 0 ]]; then
        return 1
    fi
    printf '%s\n' "${paths[@]}" | sort -u
}

patch_server_config() {
    local file="$1"

    if grep -q 'spacedev-social-preview.conf' "$file"; then
        log "  Bỏ qua (đã có include): $file"
        return 0
    fi

    if ! grep -qE 'server_name[^;]*\b(dev\.spacedev\.vn|www\.spacedev\.vn|spacedev\.vn)\b' "$file"; then
        return 0
    fi

    cp -a "$file" "$BACKUP_DIR/"
    log "  Backup: $file"

    # Chèn include trước location / đầu tiên (awk — tương thích mọi bản sed)
    awk -v line="    ${INCLUDE_LINE}" '
        /location \// && !done { print line; done=1 }
        { print }
    ' "$file" > "${file}.new"
    mv "${file}.new" "$file"

    log "  Đã thêm include: $file"
}

SITE_CONFIGS="$(find_site_configs || true)"
if [[ -z "$SITE_CONFIGS" ]]; then
    echo "Không tìm thấy file nginx có server_name spacedev.vn / dev.spacedev.vn"
    echo "Thêm thủ công vào server block:"
    echo "  $INCLUDE_LINE"
    echo "Backup snippet tại: $SNIPPETS_DIR và $MAP_CONF"
    exit 1
fi

while IFS= read -r cfg; do
    [[ -n "$cfg" ]] && patch_server_config "$cfg"
done <<< "$SITE_CONFIGS"

log "Kiểm tra cú pháp nginx..."
if ! nginx -t 2>&1; then
    log "LỖI nginx -t — khôi phục backup từ $BACKUP_DIR"
    for f in "$BACKUP_DIR"/*; do
        [[ -f "$f" ]] || continue
        base="$(basename "$f")"
        for cfg in $SITE_CONFIGS; do
            if [[ "$(basename "$cfg")" == "$base" ]]; then
                cp -a "$f" "$cfg"
                log "  Khôi phục: $cfg"
            fi
        done
    done
    nginx -t || true
    exit 1
fi

log "Reload nginx..."
if systemctl is-active --quiet nginx 2>/dev/null; then
    systemctl reload nginx
else
    service nginx reload
fi

log "Hoàn tất. Backup cấu hình cũ: $BACKUP_DIR"
log ""
log "Kiểm tra nhanh (thay YEAR và POST_ID):"
log '  curl -sL -A "facebookexternalhit/1.1" "https://spacedev.vn/tin-tuc/YEAR/POST_ID" | grep -i og:title'
