# Social preview (Open Graph) — spacedev.vn self-hosted

Frontend React (CRA) **không** render meta OG cho Facebook crawler. Luồng đúng:

1. Crawler gọi `https://spacedev.vn/tin-tuc/{year}/{id}`
2. **Nginx** nhận diện User-Agent bot → proxy sang API
3. API trả HTML có `og:title`, `og:image`, ... ([`article-social-preview.php`](../../_biong_backend/resources/views/plugins/vn4-e-learning/inc/api/frontend/v1.0/marketing/article-social-preview.php))

## Cài đặt nginx

### Bước 1 — Map User-Agent (khối `http`)

```nginx
include /var/www/spacedev.vn/deploy/nginx-social-preview-map.conf;
```

### Bước 2 — Location snippet (khối `server` của spacedev.vn)

Đặt **trước** `location /` SPA fallback:

```nginx
include /var/www/spacedev.vn/deploy/nginx-social-preview.conf;
```

Hoặc chạy tự động (khuyến nghị): `sudo bash deploy/server/install-nginx-social-preview.sh` — xem [`deploy/server/HUONG-DAN-VPS.md`](./server/HUONG-DAN-VPS.md).

### Bước 3 — Reload

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Tham khảo file đầy đủ: [`nginx-spacedev-frontend.example.conf`](./nginx-spacedev-frontend.example.conf)

## Kiểm tra

```bash
YEAR=2025 POST_ID=your_post_id ./scripts/verify-social-preview.sh
```

Hoặc thủ công:

```bash
curl -sL -A "facebookexternalhit/1.1" \
  "https://spacedev.vn/tin-tuc/2025/your_post_id" | grep -i 'og:'
```

Kỳ vọng: `og:title` là tiêu đề bài viết, **không** phải "Học viện spacedev" mặc định từ `index.html`.

Sau khi deploy nginx: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) → **Scrape Again**.

## Lưu ý

- `middleware.ts` / `vercel.json` rewrites **chỉ chạy trên Vercel hosting**, không áp dụng khi chỉ copy thư mục `build/` về server.
- Khi thêm route share mới: mở rộng `location` trong `nginx-social-preview.conf` và endpoint PHP tương ứng.
