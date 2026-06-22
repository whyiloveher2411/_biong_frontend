#!/usr/bin/env bash
set -euo pipefail

FRONTEND_BASE="${FRONTEND_BASE:-https://spacedev.vn}"
API_BASE="${API_BASE:-https://api.spacedev.vn}"
YEAR="${YEAR:-}"
POST_ID="${POST_ID:-}"
BOT_UA="${BOT_UA:-facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)}"

API_PREVIEW="${API_BASE}/api/frontend/v1.0/vn4-e-learning/marketing/article-social-preview"

usage() {
    cat <<'EOF'
Kiểm tra Open Graph preview cho bài tin tức.

Usage:
  YEAR=2026 POST_ID=516 bash deploy/server/verify-social-preview.sh

Biến môi trường (tùy chọn):
  FRONTEND_BASE   Mặc định: https://spacedev.vn (dev: https://dev.spacedev.vn)
  API_BASE        Mặc định: https://api.spacedev.vn
  YEAR            Năm archive bài viết (bắt buộc)
  POST_ID         ID bài viết (bắt buộc)
EOF
}

if [[ -z "$YEAR" || -z "$POST_ID" ]]; then
    usage
    echo ""
    echo "Lỗi: cần YEAR và POST_ID."
    exit 1
fi

ENCODED_ID="$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$POST_ID''', safe=''))")"
FRONTEND_URL="${FRONTEND_BASE}/tin-tuc/${YEAR}/${ENCODED_ID}"
API_URL="${API_PREVIEW}?year=${YEAR}&id=${ENCODED_ID}&lang=vi"

extract_og() {
    grep -ioE 'property="og:[^"]+"[^>]*content="[^"]*"|content="[^"]*"[^>]*property="og:[^"]+"' \
        | sed -E 's/.*property="(og:[^"]+)".*content="([^"]*)".*/\1=\2/; s/.*content="([^"]*)".*property="(og:[^"]+)".*/\2=\1/' \
        | sort -u
}

echo "=== 1. API preview (baseline) ==="
echo "URL: $API_URL"
API_HTML="$(curl -fsSL "$API_URL" || true)"
if [[ -z "$API_HTML" ]]; then
    echo "FAIL: API không trả HTML (404 hoặc lỗi mạng)."
    API_OG=""
else
    API_OG="$(printf '%s' "$API_HTML" | extract_og || true)"
    if [[ -z "$API_OG" ]]; then
        echo "FAIL: API không có thẻ og:*"
    else
        echo "$API_OG"
    fi
fi

echo ""
echo "=== 2. Frontend + bot User-Agent ==="
echo "URL: $FRONTEND_URL"
FRONT_HTML="$(curl -fsSL -A "$BOT_UA" "$FRONTEND_URL" || true)"
if [[ -z "$FRONT_HTML" ]]; then
    echo "FAIL: Frontend không trả HTML."
    FRONT_OG=""
else
    FRONT_OG="$(printf '%s' "$FRONT_HTML" | extract_og || true)"
    if [[ -z "$FRONT_OG" ]]; then
        echo "FAIL: Frontend không có thẻ og:*"
    else
        echo "$FRONT_OG"
    fi
fi

echo ""
echo "=== 3. So sánh ==="
DEFAULT_TITLE='og:title=Học viện spacedev'
if printf '%s\n' "$FRONT_OG" | grep -qiF "$DEFAULT_TITLE"; then
    echo "WARN: Frontend vẫn trả meta mặc định từ index.html — nginx social preview CHƯA hoạt động."
    echo "      → Chạy: sudo bash deploy/server/install-nginx-social-preview.sh"
fi

if [[ -n "$API_OG" && -n "$FRONT_OG" ]]; then
    API_TITLE="$(printf '%s\n' "$API_OG" | grep -i '^og:title=' || true)"
    FRONT_TITLE="$(printf '%s\n' "$FRONT_OG" | grep -i '^og:title=' || true)"
    API_IMAGE="$(printf '%s\n' "$API_OG" | grep -i '^og:image=' || true)"
    FRONT_IMAGE="$(printf '%s\n' "$FRONT_OG" | grep -i '^og:image=' || true)"

    if [[ "$API_TITLE" == "$FRONT_TITLE" && "$API_IMAGE" == "$FRONT_IMAGE" ]]; then
        echo "OK: Frontend (bot) khớp API preview."
        exit 0
    fi
    echo "FAIL: Frontend (bot) khác API preview."
    echo "  API:      ${API_TITLE:-?} | ${API_IMAGE:-?}"
    echo "  Frontend: ${FRONT_TITLE:-?} | ${FRONT_IMAGE:-?}"
    exit 1
fi

exit 1
