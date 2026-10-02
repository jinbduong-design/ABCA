# Changelog

## v0.2.8 — 2026-10-02
- Sửa AI production theo hướng không còn phụ thuộc bắt buộc vào GEMINI_API_KEY trên Vercel.
- Backend thử Gemini trực tiếp trước nếu có key; nếu không có hoặc provider lỗi thì tự fallback sang Vercel AI Gateway.
- Vercel AI Gateway dùng OIDC của deployment trong production, tránh hardcode secret vào source.
- Gateway fallback theo thứ tự google/gemini-3.8-flash → google/gemini-3.5-flash-lite → google/gemini-3.1-flash-lite.
- Cả AI Tutor, Hội thoại, phân tích câu và chấm bài viết đều dùng chung provider fallback mới.
- JSON response được parse an toàn hơn khi model trả về code fence.
- /api/health giờ cho biết app đang dùng direct Gemini hay Vercel AI Gateway.
- Lỗi quota và lỗi xác thực Gateway được tách riêng để UI không còn chỉ hiện một thông báo chung chung.
- Version hiển thị và service worker cache tăng lên v0.2.8.

## v0.2.7 — 2026-09-30
- Bỏ khung chat kiểu popup/card trong Hội thoại; phiên đang luyện giờ nằm trực tiếp trong màn hình app và dùng toàn bộ vùng nội dung.
- Tin nhắn tiếng Đức hiển thị English translation ngay bên dưới; tiếng Việt mặc định ẩn và chỉ mở bằng “Không hiểu? Xem tiếng Việt”.
- Gợi ý A0 ưu tiên German + English; tiếng Việt nằm sau nút riêng.
- Thêm English translation vào dữ liệu hội thoại A0 mở đầu và response contract của AI.
- Sửa nguyên nhân AI trên Vercel báo “tạm thời không khả dụng”: thêm Vercel Functions thật cho /api/tutor/chat, /api/conversation/message, /api/tutor/analyze-sentence, /api/tutor/correct-writing và /api/health.
- Tách helper Gemini dùng chung cho Vercel, hỗ trợ GEMINI_API_KEY cùng hai alias GOOGLE_API_KEY và GOOGLE_GENERATIVE_AI_API_KEY.
- Cập nhật danh sách fallback model theo Gemini hiện tại: 3.8 Flash → 3.5 Flash-Lite → 3.1 Flash-Lite.
- Nếu Vercel chưa có API key, backend giờ trả lỗi rõ “cần thêm GEMINI_API_KEY” thay vì chỉ báo AI chung chung.
- Cập nhật .env.example để nhắc AI Studio secret không tự đi theo Vercel.
- Version hiển thị và service worker cache tăng lên v0.2.7.

## v0.2.6 — 2026-09-30
- Đưa Hội thoại ra tab chính trên mobile: Học · Lộ trình · Hội thoại · Ôn từ · Thêm.
- Làm lại màn Hội thoại theo hướng luyện giao tiếp có mục tiêu thay vì chỉ là cửa sổ chat.
- Thêm 3 chế độ: Có hướng dẫn, Tự nhiên và Thử thách; mức trợ giúp và bản dịch thay đổi theo chế độ.
- Mỗi phiên có thanh tiến độ mục tiêu, nhiệm vụ tiếp theo và trạng thái hoàn thành dựa trên nội dung hội thoại thật do AI đánh giá.
- AI giữ vai trong tình huống, mỗi lượt chỉ phản hồi ngắn và chỉ sửa một lỗi quan trọng để tránh quá tải.
- Sau mỗi lượt có micro-feedback: điểm vừa làm tốt, một điểm cần sửa và một cụm câu thực dụng để mang đi.
- Thêm ngân hàng câu gợi ý có thể bấm dùng ngay, nghe lại từng câu và mở bản dịch khi cần.
- Thêm lịch sử phiên hội thoại gần đây lưu local để luyện lại; dữ liệu thuộc namespace DeutschStart nên đi cùng cơ chế backup hiện có.
- Bổ sung các tình huống A0 rất ngắn: chào hỏi 30 giây, nói số điện thoại và gọi một đồ uống đơn giản.
- Màn chọn tình huống ưu tiên đúng trình độ hiện tại và có bộ lọc A0/A1/A2.
- Version hiển thị và service worker cache tăng lên v0.2.6.

## v0.2.5 — 2026-09-30
- Khóa zoom in/out trên mobile/PWA bằng viewport cố định: maximum-scale=1 và user-scalable=no.
- Chặn pinch zoom trên thiết bị cảm ứng bằng CSS touch-action và listener gesture/touch đa điểm.
- Giữ scroll dọc bình thường để học và cuộn nội dung không bị ảnh hưởng.
- Dùng touch-action: manipulation cho nút, link và form để hạn chế double-tap zoom nhưng vẫn giữ thao tác chạm.
- Ép input/textarea/select tối thiểu 16px trên mobile để iPhone không tự zoom khi focus ô nhập.
- Giữ nguyên safe-area Dynamic Island và khóa trượt ngang từ v0.2.4.
- Version hiển thị và service worker cache tăng lên v0.2.5.

## v0.2.4 — 2026-09-30
- Sửa màn bài học full-screen trên iPhone/PWA bị Dynamic Island và đồng hồ che phần header.
- Thêm safe-area riêng cho cả Deep Lesson và Legacy Lesson, không phụ thuộc safe-area của màn app phía sau.
- Khung bài học dùng đúng chiều cao vùng nhìn thấy sau khi trừ safe-area; không còn min-height 100vh đẩy nội dung lên dưới vùng hệ thống.
- Header bài học được giữ cố định trong vùng an toàn, nút đóng và thanh tiến độ luôn nhìn thấy.
- Khóa overflow của lớp phủ bài học; chỉ phần nội dung bài học cuộn dọc để giao diện mobile ổn định hơn.
- Version hiển thị và service worker cache tăng lên v0.2.4.

## v0.2.3 — 2026-09-30
- Thêm chế độ học có hướng dẫn cho người mới ở các bài A0 đầu tiên.
- Người mới không còn bị hỏi warm-up kiến thức trước khi được dạy; bài bắt đầu bằng nghe, nhìn nghĩa và ví dụ.
- Rút gọn lượt đầu: tối đa 4 câu luyện dễ, 1 bài viết theo mẫu, 1 lượt nói và tối đa 3 câu ôn cuối.
- Bỏ challenge tình huống khó khỏi lượt học có hướng dẫn; vẫn giữ flow đầy đủ cho các bài/level về sau.
- Thêm “Chưa biết · xem đáp án” để người mới học từ đáp án thay vì bị kẹt ở câu hỏi.
- Từ mới ở chế độ người mới hiện nghĩa ngay, có nút Nghe và Nghe chậm.
- Ví dụ trong phần quy tắc có nút nghe trực tiếp; bẫy nâng cao được ẩn ở lượt beginner.
- Bài viết đầu tiên hiển thị câu mẫu trước để người học bắt chước thay vì phải tự nghĩ từ số 0.
- Giảm ngôn ngữ ký hiệu/chuyên môn ở bài A0 đầu tiên, ưu tiên cách diễn đạt gần âm tiếng Việt.
- Chuẩn hoàn thành ở chế độ beginner nhẹ hơn, tập trung vào hiểu và thử được thay vì mastery gate nặng.
- Version hiển thị và service worker cache tăng lên v0.2.3.

## v0.2.2 — 2026-09-30
- Khóa layout mobile theo chiều ngang: html/body/#root không còn trượt lệch trái phải khi vuốt.
- Giữ gesture dọc và pinch-zoom để không phá khả năng truy cập.
- Sửa vùng trên iPhone/PWA: bỏ black-translucent và thêm safe-area để nội dung nằm dưới Dynamic Island/đồng hồ.
- Header mobile thấp và gọn hơn; logo, version và streak vẫn giữ để kiểm tra nhanh.
- Bottom navigation giảm còn 4 mục: Học · Lộ trình · Ôn từ · Thêm; AI và các công cụ phụ chuyển vào Thêm.
- Home mobile rút gọn mạnh: chỉ còn bài cần học, 3 bước hôm nay và mục tiêu ngày; mô tả dài/công cụ phụ ẩn trên màn nhỏ.
- Service worker cache và version hiển thị tăng lên v0.2.2.

## v0.2.1 — 2026-09-30
- Làm lại Home theo hướng beginner-first: người mới thấy ngay một nút “Bắt đầu bài đầu tiên” thay vì phải tự chọn Từ vựng, Ngữ pháp hay AI.
- Home tự chọn bài chưa hoàn thành đầu tiên trong toàn bộ lộ trình A0 → A1 → A2 và sau mỗi bài tự chuyển sang bài kế tiếp.
- Thêm kế hoạch học 3 bước rõ ràng: Bài chính → Ôn từ → Luyện nói.
- Các công cụ AI Tutor, phát âm, lỗi sai và tra cứu được hạ xuống thành công cụ phụ để giảm rối cho người mới.
- Roadmap khóa các bài tương lai; chỉ bài đã học và đúng bài tiếp theo mới mở được.
- Bài đã hoàn thành vẫn có thể mở lại để ôn.
- Cập nhật service worker cache và version hiển thị trong app lên v0.2.1.

## v0.2.0 — 2026-09-30
- Thêm Firebase personal sync theo mô hình local-first: app vẫn dùng localStorage để chạy nhanh/offline, Firestore dùng làm backup/sync.
- Thêm Google Sign-in và khóa cloud bằng VITE_FIREBASE_ALLOWED_UID; khi chưa cấu hình UID app không tự upload dữ liệu.
- Tự đồng bộ sau thay đổi local với debounce khoảng 1,5 giây và tự so sánh thời điểm cập nhật khi đăng nhập trên thiết bị khác.
- Thêm nút Sao lưu ngay, Khôi phục cloud, trạng thái lần sync gần nhất và hiển thị/copy Firebase UID trong tab Tiến độ.
- Theo dõi thay đổi của progress, SRS, mistakes, notes, favorites và Deep Lesson mastery để kích hoạt cloud sync.
- Thêm template Firestore Rules chỉ cho đúng UID cá nhân đọc/ghi tại users/<uid>/appState/main.
- Thêm tài liệu cấu hình Firebase và các biến VITE_FIREBASE_*.
- Export/Import JSON của v0.1.1 tiếp tục được giữ làm lớp backup thứ hai.
- Version hiển thị trong app tăng lên v0.2.0.

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
