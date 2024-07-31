import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import "./App.css";
import buttonImage from './箭頭.png';
import buttonImage2 from './放大鏡.png';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'; // 引入Google Map所需要的組件
import Swal from 'sweetalert2';

// Google Maps Geocoding API URL
const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

function App() {
  
  const [val1, setVal] = useState('請輸入出發地：')
  const [val2, setVa2] = useState('請輸入目的地：')
  const [isClicked1, setIsClicked1] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [Email, setEmail] = useState(''); // 註冊表單的額外字段
  const [ModalType, setModalType] = useState('login'); // 用於切換登入、註冊和忘記密碼表單
  const [newPassword, setNewPassword] = useState('');
  const [userCenter, setUserCenter] = useState(null); // 使用者當前位置
  const [currentPosition, setCurrentPosition] = useState(null); // 用於標記的當前位置
  const [destination, setDestination] = useState(null); // 用於標記的目的地位置
  // 使用者位置初始化
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const initialUserCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCenter(initialUserCenter);
      },
      // 若未開啟位置追蹤，則跳出提示'允許存取使用者位置來使用此功能'
      () => {
        Swal.fire({
          position: 'middle',
          text: '允許存取使用者位置來使用此功能',
          icon: 'warning',
          showCloseButton: true,
          showConfirmButton: false
        });
      }
    );
  }, []);

  const handleSwap = (event) => {
    event.preventDefault(); // 防止表單提交導致的刷新
    const temp = val1;
    setVal(val2);
    setVa2(temp);
  };

  const handleInputClick = (isClicked, setIsClicked, setVal) => {
    if (!isClicked) {
      setVal('');
      setIsClicked(true);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // 在這裡處理登入邏輯
    alert(`Username: ${Username}, Password: ${Password}`);
    setShowLogin(false);
    resetFields(); // 調用 resetFields 重置輸入字段
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // 在這裡處理註冊邏輯
    alert(`Username: ${Username}, Password: ${Password}, Email: ${Email}`);
    setShowLogin(false);
    resetFields(); // 調用 resetFields 重置輸入字段
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // 在這裡處理重置密碼
    alert(`Email: ${Email}, New Password: ${newPassword}`);
    setShowLogin(false);
    resetFields(); // 調用 resetFields 重置輸入字段
  };

  const closeModal = () => {
    setShowLogin(false);
    setModalType('login'); //關閉模擬框時重置到登入畫面
  };

  const resetFields = () => {
    setUsername(''); // 重置用户名
    setPassword(''); // 重置米馬
    setNewPassword(''); // 重置新密碼
    setEmail(''); // 重置郵箱
  };

  // 設置地圖的初始中心點和縮放級別
  const mapContainerStyle = {
    width: '100%',
    height: '550px',
  };

  const handleSearchLocation = (address, setPosition) => {
    if (!address || address.trim() === '') {
      Swal.fire({
        position: 'middle',
        text: '請輸入有效的地址',
        icon: 'error',
        showCloseButton: true,
        showConfirmButton: false
      });
      return;
    }
    
    fetch(`${GEOCODING_API_URL}?address=${encodeURIComponent(address)}&key=AIzaSyBgKZmF4jZipq5RnM3rdp_cMJ34Isi4QoE`)
      .then(response => response.json())
      .then(data => {
        console.log('Geocoding API Response:', data); // 調試用日誌
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setPosition({ lat: location.lat, lng: location.lng });
        } else {
          Swal.fire({
            position: 'middle',
            text: '找不到地址，請重新輸入',
            icon: 'error',
            showCloseButton: true,
            showConfirmButton: false
          });
        }
      })
      .catch((error) => {
        console.error('Geocoding API Error:', error); // 調試用日誌
        Swal.fire({
          position: 'middle',
          text: '找不到地址，請重新輸入',
          icon: 'error',
          showCloseButton: true,
          showConfirmButton: false
        });
      });
  };

  const handleSearchClick = () => {
    handleSearchLocation(val1, setCurrentPosition);
    handleSearchLocation(val2, setDestination);
  };

  const handleCurrentLocationClick = (e) => {
    e.preventDefault();
    // 使用者目前位置經緯度
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentPosition(userPosition);
      },
      () => {
        Swal.fire({
          position: 'middle',
          text: '允許存取使用者位置來使用此功能',
          icon: 'warning',
          showCloseButton: true,
          showConfirmButton: false
        });
      }
    );
  };

  return (
    <div className="App">
      <header className="content">
        <h1>Air Quality Map</h1>
        <form>
        <div className="input-container">
        <input
            type="text"
            placeholder="請輸入出發地："
            value={val1}
            required
            onChange={(e) => setVal(e.target.value)}
            onClick={() => handleInputClick(isClicked1, setIsClicked1, setVal)}
        />
          <button type name = "change" onClick={handleSwap}>
            <img src={buttonImage} alt="button image" className="button-image"/>
          </button>
          <input 
          type="text"
          placeholder="請輸入目的地："
          value={val2}
          required
          onChange = {(e) => setVa2(e.target.value)}
          onClick={() => handleInputClick(isClicked2, setIsClicked2, setVa2)}
          />
          <button type="button" name="magnifier" onClick={handleSearchClick}>
            <img src={buttonImage2} alt="button image2" className="button-image2"/>
          </button>
          <button type="button" className="text-button"  onClick={() => setShowLogin(true)}>
              Log in
          </button>
        </div>
        </form>
      </header>
      <button className="locate-button" onClick={handleCurrentLocationClick}>
        定位到目前位置
      </button>
      <LoadScript googleMapsApiKey="AIzaSyBgKZmF4jZipq5RnM3rdp_cMJ34Isi4QoE"> {/* 設定Google Maps API Key */}

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userCenter || { lat: 25.0330, lng: 121.5654 }} // 如果沒有獲取到使用者位置則使用台北市中心
          zoom={10}
        >
          {userCenter && <Marker position={userCenter} />} {/* 在使用者位置添加標記 */}
          {currentPosition && <Marker position={currentPosition} />} {/* 在當前位置添加標記 */}
          {destination && <Marker position={destination} />} {/* 在目的地位置添加標記 */}
        </GoogleMap>
      </LoadScript>
      {showLogin && (
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
      )}
    </div>
  );
}

export default App;
