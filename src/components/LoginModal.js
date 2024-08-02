// components/LoginModal.js

import React from 'react';

const LoginModal = ({
  showLogin,
  closeModal,
  ModalType,
  setModalType,
  handleLogin,
  handleRegister,
  handleForgotPassword,
  Username,
  Password,
  Email,
  newPassword,
  setUsername,
  setPassword,
  setEmail,
  setNewPassword
}) => (
  showLogin && (
    <div className="Login">
      <div className="Login-content">
        <span className="close" onClick={closeModal}>&times;</span>
        {ModalType === 'login' && (
          <div>
            <h2>登入</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">登入</button>
            </form>
            <p><span className="link" onClick={() => setModalType('forgotPassword')}>忘記密碼？</span></p>
            <p>没有帳戶？<span className="link" onClick={() => setModalType('register')}>註冊</span></p>
          </div>
        )}
        {ModalType === 'register' && (
          <div>
            <h2>註冊</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">註冊</button>
            </form>
            <p>已有帳戶？<span className="link" onClick={() => setModalType('login')}>登入</span></p>
          </div>
        )}
        {ModalType === 'forgotPassword' && (
          <div>
            <h2>設定新密碼</h2>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit">設定新密碼</button>
            </form>
            <p>記得密碼了？<span className="link" onClick={() => setModalType('login')}>登入</span></p>
            <p>没有帳戶？<span className="link" onClick={() => setModalType('register')}>註冊</span></p>
          </div>
        )}
      </div>
    </div>
  )
);

export default LoginModal;
