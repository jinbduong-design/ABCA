# Changelog

## v0.0.3 — 2026-09-30
- Tự động chuyển cấp hiện tại theo tiến độ thật: A0 → A1 → A2.
- Tự sửa dữ liệu cũ khi mở app nếu đã hoàn thành A0/A1 nhưng `currentLevel` vẫn bị kẹt ở cấp trước.
- Sau mỗi bài hoàn thành, cấp hiện tại được tính lại trước khi lưu progress.

## v0.0.2 — 2026-09-30
- Đồng bộ tiến độ theo thời gian thực ở cấp App bằng `storageService.subscribe()`.
- Navbar, Dashboard, số lỗi và Progress tự cập nhật sau các thao tác ghi dữ liệu như học bài, AI Tutor, ôn từ và sửa lỗi.
- Khởi tạo số lỗi ngay từ storage để tránh hiển thị tạm thời là 0 khi vừa mở app.

## v0.0.1 — 2026-09-30
- Sửa lỗi phiên học 20 phút bị cộng thành 40 phút.
- Mốc khôi phục: commit `0cb8b53c977308d79605b0834f46f6b4b7d3ac74`.
