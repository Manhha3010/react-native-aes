Cách sử dụng
Ở màn encrypt
Nhập các trường Text, key, password
Sau đó nhấn Encrypt
Màn hình sẽ hiển thị ra giá trị IV, Key, Cipher text

Nếu muốn decrypt
Copy lại các giá trị đó và paste tương ứng.

Ý tưởng

Để mã hóa ta cần key, vec-tơ khởi tạo iv, và raw text
Key sẽ đc generate bằng mật khẩu và muối,
iv là giá trị ngẫu nhiên để đảm bảo độ tươi của cipher text
raw text là giá trị cần mã hóa

Khi giải mã chúng ta chỉ cần key, iv, và cipher text của người đã mã hóa để giải mã

MAKE KMA GREATER!!!
