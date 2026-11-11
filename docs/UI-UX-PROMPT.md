# System prompt · SmartCook Web UI/UX

Bạn đang thiết kế và bảo trì **SmartCook Web** bằng React, TypeScript và Tailwind CSS. Đồng bộ với SmartCook Mobile bằng chữ than, nền trắng ngà và điểm nhấn xanh lá khói, có **chế độ Sáng và Tối**. Áp dụng cho trang công khai, đăng nhập, tài khoản người dùng, quản trị và các hộp thoại.

## Bảng màu và độ tương phản

- Lấy [src/index.css](../src/index.css) làm nguồn chung. Chế độ Sáng dùng nền trắng ngà `#F7F8F3`, thẻ `#FFFEFA`, chữ than `#252B26` và xanh lá khói `#4C624E`. Chế độ Tối dùng nền than ánh xanh `#161B17`, thẻ `#202722`, chữ sáng `#F0F3EB` và xanh lá khói nhạt `#BDCEB8` cho điểm nhấn cần tương phản cao.
- Dùng `bg-canvas` cho nền trang, `bg-surface` cho thẻ, điều hướng và hộp thoại, `bg-slate-100` cho ô nhập, `border-slate-200` cho viền. Dùng `text-slate-900` cho tiêu đề, `text-slate-800` cho nội dung chính, `text-slate-500` hoặc `text-slate-600` cho mô tả.
- Nút chính dùng `bg-action text-on-action hover:bg-action-hover`. Nút phụ dùng `bg-surface text-slate-800 border border-slate-200`. Dùng `bg-panel-*`, `text-white` và `text-media-muted` cho chữ phủ lên ảnh hoặc trình phát tối cố định.
- Dùng `text-accent-ink` cho chữ nhấn và `bg-brand-100 text-accent-ink` cho nhãn hoặc bộ lọc đang chọn. Các tiện ích `orange-*` và `indigo-*` cũ được ánh xạ sang thang xanh lá khói. Dùng các token theo vai trò khi viết giao diện mới.
- Màu xanh, hổ phách và đỏ dành cho thông tin trạng thái như thành công, cảnh báo và lỗi. Luôn kết hợp với nhãn hoặc biểu tượng. Giữ màu gốc của ảnh món ăn, ảnh đại diện, video, bản đồ và logo bên thứ ba. Biểu đồ có thể dùng màu theo chuỗi dữ liệu kèm chú giải.

## Chế độ Sáng và Tối

- Dùng [ThemeContext](../src/context/ThemeContext.tsx) và [ThemeToggle](../src/components/common/ThemeToggle.tsx) cho lựa chọn hiển thị. Giao diện lần đầu theo cài đặt hệ điều hành. Lựa chọn thủ công được lưu trong trình duyệt và áp dụng khi tải lại hoặc chuyển trang.
- Đổi chế độ bằng `data-theme` trên phần tử `html` để nền, chữ, input, menu và hộp thoại đồng bộ. Nút chuyển đổi phải thao tác được bằng bàn phím và công bố trạng thái qua `aria-pressed`.
- Dùng token thích ứng cho UI. Giữ vùng phủ ảnh và trình phát có nền tối cố định khi chữ hoặc nút điều khiển cần tương phản với ảnh. Kiểm tra mọi trạng thái hover, focus, active, disabled và nội dung tải ở cả hai chế độ.
- Dùng token chữ thích ứng cho tiêu đề, mô tả và chú thích trên nền giao diện. Kiểm tra ảnh gốc trên cả hai nền trước khi dùng bản tách nền. Giữ nét chữ và chi tiết trong ảnh minh họa, đồng thời dành sẵn kích thước cho ảnh để bố cục ổn định khi tải.
- Dùng ảnh dự phòng cục bộ cho ảnh công thức và ảnh đại diện. Với ảnh do người dùng tải lên hoặc ảnh đính kèm không tải được, hiển thị trạng thái “Ảnh không khả dụng”.

## Bố cục và tương tác

- Lấy màn Tủ lạnh thông minh làm mẫu cho trang tính năng. Dùng khoảng trắng, tiêu đề rõ, icon nét và viền mảnh để phân cấp. Với thẻ công thức, cho ảnh món ăn chiếm hết chiều ngang, dùng tỷ lệ ổn định và đặt nhãn, thời gian nấu bên dưới. Tên món có thể dùng `--font-recipe` và hiển thị tối đa hai dòng trong lưới.
- Dùng icon và dấu hiệu hình học cho trạng thái đang chọn. Đặt `aria-current="page"` cho mục điều hướng hiện tại và `aria-pressed` cho bộ lọc bật tắt. Đặt nhãn tiếng Việt cho nút chỉ có icon.
- Giữ focus rõ ràng, thứ tự bàn phím hợp lý và độ tương phản dễ đọc. Trên màn hình hẹp, cho bộ lọc xuống dòng hoặc cuộn ngang trong vùng riêng. Đặt nút nổi và thanh cố định ở vị trí vẫn để người dùng thao tác được với nội dung.

## Khi sửa giao diện

1. Tái sử dụng token và thành phần dùng chung. Giữ nguyên hành vi của Tin nhắn, giỏ đi chợ, API, quyền truy cập, video, nhận diện giọng nói và hẹn giờ khi yêu cầu chỉ liên quan đến UI.
2. Kiểm tra trang trên màn hình rộng và hẹp ở cả hai chế độ. Kiểm tra màu nền, nội dung phụ, nút chính, menu, hộp thoại và focus bàn phím. Xác nhận tải lại vẫn giữ lựa chọn chủ đề.
3. Chạy `npm run build` sau khi thay đổi mã giao diện.
