# Changelog

## v0.1.1 — 2026-09-30
- Thêm Export toàn bộ dữ liệu cá nhân DeutschStart ra file JSON.
- Thêm Import/Khôi phục từ file JSON với xác nhận trước khi ghi đè dữ liệu hiện tại.
- Backup tự gom toàn bộ localStorage thuộc DeutschStart, gồm progress, SRS, mistakes, notes, favorites, Deep Lesson session/mastery và các key tương lai cùng namespace.
- Sau khi restore, app nạp lại dữ liệu để mọi màn hình đồng bộ.
- Version hiển thị trong app tăng lên v0.1.1.

## v0.1.0 — 2026-09-30
- Hoàn thiện bộ nhận diện DeutschStart cho web và màn hình điện thoại.
- Thêm logo DE đồng bộ với giao diện, wordmark, icon 192px, 512px và maskable icon cho Android.
- Thêm Web App Manifest: tên cài đặt “DeutschStart”, chế độ standalone, theme/background color và metadata tiếng Việt.
- Thêm cấu hình iPhone/iPad Add to Home Screen, Android install, favicon và metadata chia sẻ mạng xã hội.
- Thêm service worker cơ bản: cache app shell để mở lại ổn định, không cache API và tự dọn cache version cũ.
- Header dùng logo thật và hỗ trợ safe-area trên thiết bị có tai thỏ/Dynamic Island.
- Package được đổi tên từ react-example thành deutschstart.
- Version hiển thị trong app tăng lên v0.1.0.

## v0.0.9 — 2026-09-30
- Hoàn thành lesson không còn cộng cứng 5 phút và 5 từ.
- Thời gian học lấy từ `lesson.estimatedMinutes`; số từ học mới lấy từ danh sách vocabulary thật của lesson.
- Deep Lesson bỏ lần cộng bù thời gian cũ để tránh đếm trùng sau khi chuyển sang metric thật.
- Học lại một lesson vẫn cộng thời gian luyện tập, nhưng không cộng lại số từ và số bài đã hoàn thành.
- Version hiển thị trong app tăng đồng bộ lên v0.0.9.

## v0.0.8 — 2026-09-30
- Daily Session lấy từ mới và ngữ pháp theo đúng level hiện tại thay vì nội dung cố định.
- Từ mới loại trừ các từ đã vào SRS; sau khi hoàn thành phiên, các từ mới được lên lịch ôn lại vào ngày hôm sau.
- Bước ôn SRS có nút Khó / Ổn / Dễ và cập nhật lịch ôn thật thay vì chỉ hiển thị từ.
- Bài phản xạ lấy trực tiếp từ grammar rule của phiên; câu luyện nói cũng thay đổi theo nội dung hôm đó.
- Số từ đã học trong progress chỉ tăng theo số từ mới thực tế, không còn cộng cứng 8 từ.
- Version hiển thị trong app tăng đồng bộ lên v0.0.8.

## v0.0.7 — 2026-09-30
- Hiển thị version hiện tại trực tiếp trên thanh đầu của app để kiểm tra nhanh bản đang chạy.
- Thêm nguồn version dùng chung trong `src/version.ts`; từ các bản sau version hiển thị và `package.json` sẽ được tăng cùng nhau.

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
