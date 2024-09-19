import Swal from 'sweetalert2';

// 處理登入邏輯的函數
export const handleLogin = (username, password) => {
  // 在這裡處理登入邏輯
  Swal.fire(`Username: ${username}, Password: ${password}`); // 顯示使用者名稱與密碼
};

// 處理註冊邏輯的函數
export const handleRegister = (username, password, email) => {
  // 在這裡處理註冊邏輯
  Swal.fireSwal.fire(`Username: ${username}, Password: ${password};  , Email: ${email}`); // 顯示使用者名稱、密碼與電子郵件
};

// 處理忘記密碼邏輯的函數
export const handleForgotPassword = (email, newPassword) => {
  // 在這裡處理重置密碼
  Swal.fire(`Email: ${email}, New Password: ${newPassword}`); // 顯示電子郵件與新密碼
};

// 重置所有輸入框的函數
export const resetFields = (setUsername, setPassword, setEmail, setNewPassword) => {
  setUsername(''); // 清空使用者名稱輸入框
  setPassword(''); // 清空密碼輸入框
  setEmail(''); // 清空電子郵件輸入框
  setNewPassword(''); // 清空新密碼輸入框
};