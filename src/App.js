import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import MapContainer from './components/MapContainer';
import LoginModal from './components/LoginModal';
import Chatbot from './components/Chatbot'; // 引入聊天機器人組件
import chat from './messenger.png';
import './App.css';
import { initialState, useLocationState } from './models/LocationModel';
import {
  handleSwap,
  handleSearchLocation,
  handleCurrentLocationClick
} from './controllers/locationController';
import {
  handleLogin,
  handleRegister,
  handleForgotPassword,
  resetFields
} from './controllers/userController';

function App() {
  const [state, setState] = useState(initialState);
  const locationActions = useLocationState(setState);
  const [showLogin, setShowLogin] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false); // 管理聊天機器人的可見性
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [Email, setEmail] = useState('');
  const [ModalType, setModalType] = useState('login');
  const [newPassword, setNewPassword] = useState('');
  const [isClicked1, setIsClicked1] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const initialUserCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        locationActions.setUserCenter(initialUserCenter);
      },
      () => {
        alert('允許存取使用者位置來使用此功能');
      }
    );
  }, [locationActions]);

  const handleSearchClick = () => {
    if (state.val1 !== state.prevVal1 || state.val2 !== state.prevVal2) {
      handleSearchLocation(state.val1, locationActions.setCurrentPosition);
      handleSearchLocation(state.val2, locationActions.setDestination);
      
      setState({
        ...state,
        prevVal1: state.val1,
        prevVal2: state.val2,
      });
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
      />
      <MapContainer
        mapContainerStyle={{ width: '100%', height: '550px' }}
        userCenter={state.userCenter}
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
        onClick={() => setShowChatbot(!showChatbot)} // 點擊切換聊天機器人的可見性
      />
      <Chatbot isVisible={showChatbot} onClose={() => setShowChatbot(false)} /> {/* 添加聊天機器人 */}
    </div>
  );
}

export default App;