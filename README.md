# Gemini Folder Manager

Một Chrome Extension mạnh mẽ giúp bạn quản lý, phân loại và lưu trữ các cuộc trò chuyện trên Google Gemini vào các thư mục gọn gàng, ngăn nắp.

## 🌟 Tính năng nổi bật

### 📁 Quản lý Thư mục thông minh
*   **Không giới hạn**: Tạo số lượng thư mục tùy ý.
*   **Đa cấp (Nested Folders)**: Hỗ trợ phân cấp thư mục lên đến **3 cấp độ**.
*   **Kéo & Thả (Drag & Drop)**: Sắp xếp vị trí folder và chat cực nhanh bằng cách kéo thả.
*   **Thao tác nhanh**: Đổi tên, xóa, dọn dẹp thư mục chỉ với 1 cú click.

### 💾 Lưu & Quản lý Chat
*   **Lưu nhanh**: Lưu link cuộc trò chuyện hiện tại vào thư mục mong muốn.
*   **Tự động đặt tên**: Tự động lấy tiêu đề chat hoặc cho phép bạn đặt tên tùy chỉnh.
*   **Icon sinh động**: Tự động gán icon ngẫu nhiên cho mỗi chat để dễ nhận diện.
*   **Di chuyển linh hoạt**: Kéo thả chat giữa các folder dễ dàng.

### 🎨 Giao diện & Trải nghiệm (UI/UX)
*   **Dark/Light Mode**: Tự động đồng bộ giao diện Sáng/Tối theo Google Gemini.
*   **Side Tab tiện lợi**: Luôn có một thanh tab nhỏ ở mép trái màn hình để mở panel nhanh chóng.
*   **Floating Button**: Nút nổi di động (có thể tắt nếu không thích).
*   **Resize Panel**: Tùy chỉnh độ rộng của bảng quản lý cho phù hợp với màn hình.
*   **Menu hiện đại**: Thiết kế menu mới với icon trực quan.

### 🛡️ An toàn & Bảo mật
*   **Dữ liệu cục bộ**: Toàn bộ dữ liệu được lưu trên trình duyệt của bạn (`chrome.storage.local`).
*   **Không thu thập dữ liệu**: Extension không gửi bất kỳ thông tin nào ra bên ngoài.
*   **Chống XSS**: Cơ chế bảo mật chặn các link độc hại trong quá trình Import dữ liệu.
*   **Kiểm tra dữ liệu**: Hệ thống tự động kiểm tra tính hợp lệ của file backup khi khôi phục.

## 🚀 Hướng dẫn cài đặt

1.  Tải hoặc Clone source code về máy.
2.  Mở trình duyệt Chrome (hoặc Edge, Brave...).
3.  Truy cập địa chỉ: `chrome://extensions/`.
4.  Bật **Developer mode** (Chế độ dành cho nhà phát triển) ở góc trên bên phải.
5.  Bấm vào nút **Load unpacked** (Tải tiện ích đã giải nén).
6.  Chọn thư mục chứa source code (`gemini-folders`).
7.  Truy cập [gemini.google.com](https://gemini.google.com) để trải nghiệm.

## 📖 Hướng dẫn sử dụng

### 1. Mở Panel quản lý
Có 2 cách để mở bảng quản lý:
*   **Cách 1**: Bấm vào **Nút tròn nổi** (Floating Button) ở góc màn hình (có thể kéo để di chuyển vị trí).
*   **Cách 2**: Bấm vào **Thanh Tab nhỏ** (Side Tab) nằm ở mép trái màn hình.

### 2. Tạo Folder & Lưu Chat
*   **Tạo Folder**: Nhập tên vào ô "Tên Folder mới..." và bấm **Tạo**.
*   **Tạo Folder con**: Bấm dấu `+` bên cạnh tên folder để tạo folder con (Hỗ trợ tối đa 3 cấp).
*   **Lưu Chat**: Mở chat trên Gemini -> Mở Panel -> Chọn Folder -> Bấm **Lưu**.

### 3. Menu Tùy chọn (Dấu 3 chấm)
Bấm vào icon 3 chấm dọc ở góc trên bên phải panel để truy cập các tính năng:
*   **Backup Data**: Xuất dữ liệu hiện tại ra file `.json` để sao lưu.
*   **Restore Data**: Khôi phục dữ liệu từ file backup.
    *   *Lưu ý*: Dữ liệu cũ sẽ bị ghi đè. File backup phải tuân thủ cấu trúc tối đa 3 cấp thư mục.
*   **Ẩn/Hiện nút nổi**: Tắt nút tròn nổi nếu bạn thấy vướng (bạn vẫn có thể mở panel bằng Side Tab).

### 4. Sắp xếp & Chỉnh sửa
*   **Kéo thả**: Giữ chuột trái vào folder/chat và kéo đến vị trí mới.
*   **Đổi tên**: Bấm vào icon cây bút chì (✏️) để sửa tên trực tiếp.
*   **Xóa**: Bấm vào icon thùng rác (🗑️).
