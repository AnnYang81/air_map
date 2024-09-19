import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import MapContainer from './components/MapContainer';
import LoginModal from './components/LoginModal';
import Chatbot from './components/Chatbot';
import chat from './messenger.png';
import './App.css';
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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const initialUserCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCenter(initialUserCenter); // 更新使用者位置
        locationActions.setUserCenter(initialUserCenter);
      },
      (error) => {
        console.error('定位錯誤:', error);
        Swal.fire({
          position: 'middle',
          text: '允許存取使用者位置來使用此功能',
          icon: 'warning',
          showCloseButton: true,
          showConfirmButton: false,
        });
      }
    );
  }, []);

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
