import React, { useState } from 'react';
import './Chatbot.css'; 

const Chatbot = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

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
        console.error('Error from server:', data.error);
        alert('伺服器發生錯誤，請稍後再試。');
      }
    } catch (error) {
      console.error('Error in fetch operation:', error);
      alert('無法連接到伺服器，請檢查您的網絡連接。');
    }
  };
  

  return (
    <div className={`chatbot-container ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="chatbot-header">
        <h4>聊天機器人</h4>
        <button onClick={onClose}>×</button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="請輸入文字……"
        />
        <button onClick={handleSendMessage}>發送</button>
      </div>
    </div>
  );
};

export default Chatbot;