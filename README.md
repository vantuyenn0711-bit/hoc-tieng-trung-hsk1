# HSK 1 — Học tiếng Trung trên iPhone

Trang luyện nghe nói: 500 từ vựng, 25 hội thoại theo chủ đề, từ/cụm/câu mẫu và phần tự đặt câu.

Trang chính là [`index.html`](./index.html). Tối ưu để mở bằng Safari và chia sẻ đường dẫn HTTPS qua Zalo.

## Xuất bản bằng GitHub Pages

Vào **Settings → Pages → Build and deployment**, chọn **Deploy from a branch**, `main`, `/(root)`, sau đó **Save**.

Địa chỉ dự kiến: https://vantuyenn0711-bit.github.io/hoc-tieng-trung-hsk1/

## Lưu ý âm thanh

Giọng trực tuyến cần Internet và có thể không được nguồn phát cho phép; chế độ giọng iPhone cần Safari hỗ trợ đọc tiếng Trung. Nên mở trang bằng Safari trực tiếp, không mở file `.html` dưới dạng tệp đính kèm Zalo.


## Premium UI và Tổng quan học
- Bốn trang: `index.html`, `stories.html`, `ai.html`, `dashboard.html`.
- `premium.css` và `premium.js` thêm giao diện gọn cho iPhone, dark mode và lưu tiến độ.
- Đánh dấu đã học 25 hội thoại, 28 nhóm từ, 16 truyện; lưu từ và truyện yêu thích.
- Tiến độ dùng localStorage trên thiết bị, không đồng bộ qua các điện thoại.
- Audio và Gemini API giữ nguyên; khóa Gemini chỉ nằm trong Render Environment, không đưa vào repo.
