import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import MapContainer from './components/MapContainer';
import LoginModal from './components/LoginModal';
import Chatbot from './components/Chatbot';
import chat from './messenger.png';
import './App.css';
import './mobile.css';
import { initialState, useLocationState } from './LocationModel';
import {
  handleLogin,
  handleRegister,
  handleForgotPassword,
  resetFields
} from './controllers/userController';
import SearchHistoryModal from './components/SearchHistoryModal';
import Swal from 'sweetalert2';
import { handleSearchLocation, handleCurrentLocationClick, handleSwap } from './controllers/locationController';

function App() {
  const [state, setState] = useState(initialState);
  const locationActions = useLocationState(setState);
  
  const [userCenter, setUserCenter] = useState(null); // 使用 useState 管理 userCenter
  const [showLogin, setShowLogin] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [Email, setEmail] = useState('');
  const [ModalType, setModalType] = useState('login');
  const [newPassword, setNewPassword] = useState('');
  const [isClicked1, setIsClicked1] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    // 使用 navigator API 獲取使用者的當前地理位置
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 如果定位成功，取得使用者的經緯度資訊
        const initialUserCenter = {
          lat: position.coords.latitude, // 使用者的緯度
          lng: position.coords.longitude, // 使用者的經度
        };
        setUserCenter(initialUserCenter); // 使用 setUserCenter 更新組件中的使用者位置狀態
        locationActions.setUserCenter(initialUserCenter); // 調用 locationActions 方法來更新使用者的位置
      },
      (error) => {
        // 如果定位失敗，打印錯誤資訊並彈出警告
        console.error('定位錯誤:', error); // 在控制台顯示錯誤訊息
        Swal.fire({
          position: 'middle', // 彈窗顯示於畫面中央
          text: '允許存取使用者位置來使用此功能', // 顯示的文字提示使用者允許存取位置
          icon: 'warning', // 警告圖示
          showCloseButton: true, // 顯示關閉按鈕
          showConfirmButton: false, // 不顯示確認按鈕
        });
      }
    );
  }, []); // 空依賴陣列意味著此 effect 只會在組件初次渲染時執行一次

  const handleSearchClick = () => {
    if (state.val1 !== state.prevVal1 || state.val2 !== state.prevVal2) {
      handleSearchLocation(state.val1, locationActions.setCurrentPosition);
      handleSearchLocation(state.val2, locationActions.setDestination);

      setState({
        ...state,
        prevVal1: state.val1,
        prevVal2: state.val2,
      });

      if (state.val1 && state.val2) {
        setSearchHistory([...searchHistory, state.val1, state.val2]);
      }
    }
  };

  return (
    <div className="App">
      <Header />
      <InputForm
        val1={state.val1}
        val2={state.val2}
        setVal1={locationActions.setVal1}
        setVal2={locationActions.setVal2}
        handleSwap={() => handleSwap(state, setState)}
        handleSearchClick={handleSearchClick}
        handleInputClick={(isClicked, setVal) => {
          if (!isClicked) {
            setVal('');
            isClicked === isClicked1 ? setIsClicked1(true) : setIsClicked2(true);
          }
        }}
        setShowLogin={setShowLogin}
        isClicked1={isClicked1}
        isClicked2={isClicked2}
        searchHistory={searchHistory}
        setSearchHistory={setSearchHistory}
        showHistoryModal={showHistoryModal}
        setShowHistoryModal={setShowHistoryModal}
      />
      <MapContainer
        mapContainerStyle={{ width: '100%', height: '550px' }}
        userCenter={userCenter}  // 傳遞 userCenter
        setUserCenter={setUserCenter}  // 傳遞 setUserCenter
        currentPosition={state.currentPosition}
        destination={state.destination}
        handleCurrentLocationClick={() => handleCurrentLocationClick(locationActions.setCurrentPosition)}
      />
      <LoginModal
        showLogin={showLogin}
        closeModal={() => setShowLogin(false)}
        ModalType={ModalType}
        setModalType={setModalType}
        handleLogin={(e) => {
          e.preventDefault();
          handleLogin(Username, Password);
          setShowLogin(false);
          resetFields(setUsername, setPassword, setEmail, setNewPassword);
        }}
        handleRegister={(e) => {
          e.preventDefault();
          handleRegister(Username, Password, Email);
          setShowLogin(false);
          resetFields(setUsername, setPassword, setEmail, setNewPassword);
        }}
        handleForgotPassword={(e) => {
          e.preventDefault();
          handleForgotPassword(Email, newPassword);
          setShowLogin(false);
          resetFields(setUsername, setPassword, setEmail, setNewPassword);
        }}
        Username={Username}
        Password={Password}
        Email={Email}
        newPassword={newPassword}
        setUsername={setUsername}
        setPassword={setPassword}
        setEmail={setEmail}
        setNewPassword={setNewPassword}
      />
      <img 
        src={chat} 
        alt="Chat Icon" 
        className="chat-icon" 
        onClick={() => setShowChatbot(!showChatbot)}
      />
      <Chatbot 
        isVisible={showChatbot} 
        onClose={() => setShowChatbot(false)}
      />
      {showHistoryModal && (
        <SearchHistoryModal
          searchHistory={searchHistory}
          closeModal={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
}

export default App;
