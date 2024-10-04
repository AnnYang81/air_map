import React from 'react';
import buttonImage from './change.png';
import buttonImage2 from './search.png';

const InputForm = ({
  val1,
  val2,
  setVal1,
  setVal2,
  handleSwap,
  handleSearchClick,
  handleInputClick,
  setShowLogin,
  isClicked1,
  isClicked2,
  showHistoryModal,
  setShowHistoryModal
}) => (
  <form className="input-container">
    <div className="input-wrapper">
      <input
        type="text"
        placeholder="請輸入出發地："
        value={val1}
        onChange={(e) => setVal1(e.target.value)}
        onClick={() => handleInputClick(isClicked1, setVal1)}
        className="input-field"
      />
      <button type="button" name="change" onClick={handleSwap} className="swap-button">
        <img src={buttonImage} alt="change image" className="button-image" />
      </button>
      <input
        type="text"
        placeholder="請輸入目的地："
        value={val2}
        onChange={(e) => setVal2(e.target.value)}
        onClick={() => handleInputClick(isClicked2, setVal2)}
        className="input-field"
      />
      <button type="button" name="magnifier" onClick={handleSearchClick} className="search-button">
        <img src={buttonImage2} alt="search icon" className="button-image2" />
      </button>
    </div>
    <div className="button-row"> {/* 新增此行 */}
      <button type="button" className="text-button" onClick={() => setShowLogin(true)}>
        登入
      </button>
      <button type="button" className="history-button" onClick={() => setShowHistoryModal(true)}>
        搜尋紀錄
      </button>
    </div>
  </form>
);

export default InputForm;
