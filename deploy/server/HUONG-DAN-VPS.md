# Hướng dẫn VPS — Facebook OG preview (spacedev.vn)

Quy trình deploy hiện tại của team:

| Bước | Việc làm |
|------|----------|
| 1 | Push code backend từ máy local → `git pull` trên server |
| 2 | `cd /var/www/dev.spacedev.vn` → `sh getbuild.sh` (zip từ Vercel) |
| 3 | Kiểm tra trên **dev.spacedev.vn** |
| 4 | `bash deploy-prod.bash` (copy dev → production **spacedev.vn**) |
| 5 | Cài / cập nhật nginx (một lần, hoặc sau mỗi lần cần) |

Sau khi giải nén zip, file nginx nằm tại:

```
/var/www/dev.spacedev.vn/deploy/
/var/www/spacedev.vn/deploy/          (sau deploy-prod)
```

**Không** có thư mục `build/` trên server — zip chứa nội dung thẳng ở root domain.

---

## Bước 1 — Push code từ máy Mac

### Backend (PHP social preview)

```bash
cd /Users/mac/Desktop/backend/_biong_backend
git add resources/views/plugins/vn4-e-learning/inc/api/frontend/v1.0/marketing/
git commit -m "Củng cố endpoint OG preview cho share Facebook bài tin tức"
git push
```

### Frontend (deploy + script cài nginx)

```bash
cd /Users/mac/Desktop/backend/_biong_frontend
git add deploy/ scripts/ package.json vercel.json
git add -u middleware.ts
git commit -m "Thêm cấu hình nginx social preview và script cài đặt cho VPS"
git push
```

Đợi Vercel build xong (frontend) trước khi chạy `getbuild.sh`.

---

## Bước 2 — SSH vào VPS

```bash
ssh USER@IP_VPS
```

---

## Bước 3 — Pull backend

```bash
cd /path/to/backend   # thư mục backend trên server (hỏi admin nếu chưa biết)
git pull
```

Không xóa file, không migrate — chỉ pull.

---

## Bước 4 — Lấy frontend build mới (dev)

```bash
cd /var/www/dev.spacedev.vn
sh getbuild.sh
```

Kiểm tra có thư mục deploy:

```bash
ls -la deploy/
ls -la deploy/server/install-nginx-social-preview.sh
```

---

## Bước 5 — Cài nginx (an toàn, có backup)

```bash
cd /var/www/dev.spacedev.vn
sudo bash deploy/server/install-nginx-social-preview.sh
```

Script sẽ:

- Copy snippet vào `/etc/nginx/snippets/` và `/etc/nginx/conf.d/`
- Thêm `include` vào config **spacedev.vn** và **dev.spacedev.vn** (nếu chưa có)
- `nginx -t` → nếu lỗi thì **tự khôi phục** backup, **không reload**
- `reload` nginx nếu OK

Chạy lại script nhiều lần **không sao** (idempotent).

---

## Bước 6 — Kiểm tra trên dev

```bash
curl -sL -A "facebookexternalhit/1.1" \
  "https://dev.spacedev.vn/tin-tuc/2026/516" | grep -i 'og:title'
```

Kỳ vọng: tiêu đề **bài viết**, không phải `Học viện spacedev`.

---

## Bước 7 — Deploy production

```bash
cd /var/www/dev.spacedev.vn
bash deploy-prod.bash
```

(SCRIPT hiện có của team — **không thay đổi** trong repo này.)

Sau deploy-prod, chạy lại cài nginx (để chắc snippet khớp bản prod):

```bash
sudo bash /var/www/spacedev.vn/deploy/server/install-nginx-social-preview.sh
```

Hoặc từ dev (script tự tìm prod nếu có `deploy/`):

```bash
cd /var/www/dev.spacedev.vn
sudo bash deploy/server/install-nginx-social-preview.sh
```

---

## Bước 8 — Kiểm tra production

```bash
curl -sL -A "facebookexternalhit/1.1" \
  "https://spacedev.vn/tin-tuc/2026/516" | grep -i 'og:'
```

Hoặc (nếu có script verify trong zip):

```bash
cd /var/www/spacedev.vn
YEAR=2026 POST_ID=516 bash deploy/server/verify-social-preview.sh
```

Facebook: https://developers.facebook.com/tools/debug/ → URL bài → **Scrape Again**.

---

## Khắc phục sự cố

| Vấn đề | Lệnh |
|--------|------|
| Xem log nginx | `sudo tail -50 /var/log/nginx/error.log` |
| Test cấu hình | `sudo nginx -t` |
| Khôi phục backup | Thư mục `/etc/nginx/.backup-social-preview-*` — copy file cũ về `sites-enabled` |

Không xóa database hay thư mục upload — script **chỉ** sửa nginx snippet.
