# DeutschStart Personal Firebase Sync

Mục tiêu: chỉ một người dùng cá nhân được phép đồng bộ dữ liệu học giữa các thiết bị.

## 1. Tạo Firebase Web App
Trong Firebase Console:
- Tạo/chọn project.
- Add app → Web.
- Copy Firebase config.

## 2. Bật Google Sign-in
Authentication → Sign-in method → Google → Enable.

## 3. Tạo Firestore
Firestore Database → Create database → chọn Production mode.

## 4. Thêm biến môi trường vào Vercel
Thêm các biến sau cho Production:

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_STORAGE_BUCKET (nếu có)
- VITE_FIREBASE_MESSAGING_SENDER_ID (nếu có)

Chưa cần VITE_FIREBASE_ALLOWED_UID ở lần deploy đầu tiên.

## 5. Lấy UID cá nhân
Deploy lại app, mở DeutschStart → Tiến độ → Cloud cá nhân → Đăng nhập Google.

App sẽ hiển thị Firebase UID. Copy UID đó.

## 6. Khóa app vào đúng UID
Thêm biến:

VITE_FIREBASE_ALLOWED_UID=<UID vừa copy>

Sau đó redeploy.

## 7. Khóa Firestore Rules
Mở file firestore.rules.example, thay:

PASTE_YOUR_FIREBASE_UID_HERE

bằng đúng UID cá nhân rồi dán rules đó vào Firestore Rules và Publish.

Sau bước này:
- Chỉ UID đó đọc/ghi được document cloud.
- Người khác dù biết URL app cũng không đọc được dữ liệu.
- App không tự upload nếu VITE_FIREBASE_ALLOWED_UID chưa được cấu hình.

## Cơ chế sync
- localStorage vẫn là dữ liệu chính để app chạy nhanh/offline.
- Khi dữ liệu local thay đổi, app debounce khoảng 1.5 giây rồi backup lên Firestore.
- Cloud document nằm tại:
  users/<uid>/appState/main
- Khi đăng nhập ở thiết bị mới:
  - Nếu cloud mới hơn local → lấy cloud xuống.
  - Nếu local mới hơn cloud → đẩy local lên.
- Có nút “Sao lưu ngay” và “Khôi phục cloud” để điều khiển thủ công.
- Export/Import JSON ở v0.1.1 vẫn giữ nguyên như lớp backup thứ hai.
