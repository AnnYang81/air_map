// components/SearchHistoryModal.js

import React from 'react';


const SearchHistoryModal = ({ searchHistory, closeModal }) => (
  <div className="history-modal">
    <div className="history-modal-content">
      // 關閉按鈕，點擊後會觸發closeModal函數來關閉彈窗
      <span className="history-close" onClick={closeModal}>&times;</span>
      <div className="history-content">
        <h4>搜尋紀錄</h4>
        <ul>
          {searchHistory.length === 0 ? (
            <li>沒有搜尋紀錄</li>  // 如果搜尋紀錄為空，顯示 "沒有搜尋紀錄"
          ) : (
            searchHistory.map((item, index) => (
              <li key={index}>{item}</li>  // 顯示每個搜尋紀錄項目
            ))
          )}
        </ul>
      </div>
    </div>
  </div>
);

export default SearchHistoryModal;
