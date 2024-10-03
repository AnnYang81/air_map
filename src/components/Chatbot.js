import React, { useEffect, useRef, useState } from 'react';
import './Chatbot.css';

const Chatbot = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState([]); // 使用 useState 來管理訊息狀態
  const [inputValue, setInputValue] = useState(''); // 用於管理輸入框的值
  const chatbotRef = useRef(null); // 參考聊天機器人容器，方便後續判斷是否點擊在外部

  // 發送訊息的處理函式
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return; // 如果輸入框為空，不進行處理

    const userMessage = {
      sender: 'user', // 標記訊息為使用者發送
      text: inputValue, // 設置訊息內容為輸入的文字
    };

    setMessages([...messages, userMessage]); // 將使用者訊息加入訊息列表中
    setInputValue(''); // 清空輸入框

    try {
      // 發送請求至伺服器
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 設置請求頭為 JSON 格式
        },
        body: JSON.stringify({ message: inputValue }), // 將訊息內容作為請求的 body
      });

      const data = await response.json(); // 將伺服器回應轉換為 JSON 格式

      if (response.ok) {
        const botMessage = {
          sender: 'bot', // 標記訊息為機器人發送
          text: data.reply, // 設置機器人回應的內容
        };
        setMessages([...messages, userMessage, botMessage]); // 將使用者與機器人的訊息加入訊息列表中
      } else if (response.status === 429) {
        alert('您已超過使用限制，請稍後再試。'); // 使用限制警告
      } else {
        console.error('伺服器錯誤：', data.error); // 顯示伺服器錯誤
        alert('伺服器發生錯誤，請稍後再試。');
      }
    } catch (error) {
      console.error('請求錯誤：', error); // 顯示請求錯誤
      alert('無法連接到伺服器，請檢查您的網絡連接。');
    }
  };

  useEffect(() => {
    // 檢查是否點擊在聊天機器人外部，如果是則關閉
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        onClose(); // 調用關閉函式
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside); // 添加監聽器監測點擊
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // 移除監聽器
    };
  }, [isVisible, onClose]); // 僅當 isVisible 或 onClose 變更時重新運行

  return (
    isVisible && ( // 僅當聊天機器人可見時才渲染
      <div className="chatbot-container" ref={chatbotRef}>
        <div className="chatbot-header">聊天機器人</div>
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`chatbot-message ${message.sender}`}>
              {message.text} {/* 顯示訊息內容 */}
            </div>
          ))}
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // 當輸入變更時，更新輸入框內容
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage(); // 按下 Enter 鍵時發送訊息
            }}
            placeholder="輸入訊息..." // 輸入框的佔位文字
          />
          <button onClick={handleSendMessage}>發送</button> {/* 點擊按鈕發送訊息 */}
        </div>
      </div>
    )
  );
};

export default Chatbot;
