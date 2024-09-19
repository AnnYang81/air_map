import React, { useEffect, useRef, useState } from 'react';
import './Chatbot.css';

const Chatbot = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatbotRef = useRef(null);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      sender: 'user',
      text: inputValue,
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage = {
          sender: 'bot',
          text: data.reply,
        };
        setMessages([...messages, userMessage, botMessage]);
      } else if (response.status === 429) {
        alert('您已超過使用限制，請稍後再試。');
      } else {
        console.error('伺服器錯誤：', data.error);
        alert('伺服器發生錯誤，請稍後再試。');
      }
    } catch (error) {
      console.error('請求錯誤：', error);
      alert('無法連接到伺服器，請檢查您的網絡連接。');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  return (
    isVisible && (
      <div className="chatbot-container" ref={chatbotRef}>
        <div className="chatbot-header">聊天機器人</div>
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`chatbot-message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="輸入訊息..."
          />
          <button onClick={handleSendMessage}>發送</button>
        </div>
      </div>
    )
  );
};

export default Chatbot;
