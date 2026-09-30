# Changelog

## v0.0.6 — 2026-09-30
- Sửa lỗi lần đầu mở app toàn bộ từ vựng đều bị tính là “đến hạn ôn”.
- Flashcard SRS giờ chỉ được tạo khi người học thực sự đánh giá một từ.
- Phiên học 20 phút không còn lấy 3 từ đầu danh sách để giả làm từ cần ôn; nếu chưa có lịch ôn sẽ hiển thị trạng thái trống rõ ràng.
- Số từ ở màn tổng kết phiên học được tính theo dữ liệu thực tế.

## v0.0.5 — 2026-09-30
- Nút đặt lại tiến độ giờ xóa đúng toàn bộ dữ liệu học cục bộ.
- Xóa thêm phiên Deep Lesson đang dở, mastery của Deep Lesson và danh sách từ yêu thích.
- Tránh tình trạng reset xong nhưng mở lại bài/từ vựng vẫn thấy dữ liệu cũ.

## v0.0.4 — 2026-09-30
- Loại bỏ toàn bộ kết quả AI giả khi Gemini/API không khả dụng.
- Chat, hội thoại, phân tích câu và chấm bài giờ báo rõ AI đang tạm thời không khả dụng thay vì tự khen câu đúng hoặc tự cho điểm.
- Chỉ cộng thời gian học và phát âm thanh thành công khi AI thực sự trả kết quả.

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
