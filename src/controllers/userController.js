import Swal from 'sweetalert2';

export const handleLogin = (username, password) => {
  // 在這裡處理登入邏輯
  Swal.fire(`Username: ${username}, Password: ${password}`);
};

export const handleRegister = (username, password, email) => {
  // 在這裡處理註冊邏輯
  Swal.fire(`Username: ${username}, Password: ${password}, Email: ${email}`);
};

export const handleForgotPassword = (email, newPassword) => {
  // 在這裡處理重置密碼
  Swal.fire(`Email: ${email}, New Password: ${newPassword}`);
};

export const resetFields = (setUsername, setPassword, setEmail, setNewPassword) => {
  setUsername('');
  setPassword('');
  setEmail('');
  setNewPassword('');
};