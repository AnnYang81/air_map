import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';

const MapContainer = React.memo(({ userCenter, currentPosition, destination, handleCurrentLocationClick }) => {
  const [response, setResponse] = useState(null);  // 儲存路線服務回應
  const [customLocations, setCustomLocations] = useState([]); // 儲存自定義位置
  const [selectedLocation, setSelectedLocation] = useState(null); // 儲存當前選中的標記點
  const [showUserLocation, setShowUserLocation] = useState(false); // 控制是否顯示使用者位置
  const [mapCenter, setMapCenter] = useState({ lat: 25.0330, lng: 121.5654 }); // 地圖中心狀態

  const mapStyles = {
    width: '100%',
    height: '530px', // 確保地圖有高度
  };

  // 初始化自定義標記位置
  useEffect(() => {
    const savedLocations = JSON.parse(localStorage.getItem('customLocations'));
    console.log('Saved Locations from localStorage:', savedLocations); // 檢查儲存的自定義位置

    if (savedLocations && savedLocations.length > 0) {
      setCustomLocations(savedLocations);
    } else {
      const defaultLocations = [
        { lat: 25.118751, lng: 121.518986, label: "機器設置點 1", data: "這是機器設置點 1 的相關資料。" },
        { lat: 25.11448123192722, lng: 121.51598878198111, label: "機器設置點 2", data: "這是機器設置點 2 的相關資料。" },
        { lat: 25.116535841682122, lng: 121.5172065049004, label: "機器設置點 3", data: "這是機器設置點 3 的相關資料。" }
      ];
      setCustomLocations(defaultLocations);
      localStorage.setItem('customLocations', JSON.stringify(defaultLocations));
      console.log('Set Default Locations:', defaultLocations); // 檢查是否正確設置預設位置
    }
  }, []);

  // 更新本地存儲中的自定義標記位置
  useEffect(() => {
    if (customLocations.length) {
      localStorage.setItem('customLocations', JSON.stringify(customLocations));
      console.log('Updated customLocations:', customLocations); // 檢查 customLocations 更新情況
    }
  }, [customLocations]);

  // 當使用者位置更新時，動態設置地圖中心
  useEffect(() => {
    if (showUserLocation && userCenter) {
      setMapCenter(userCenter); // 更新地圖中心到使用者位置
      console.log("地圖中心已更新至使用者位置:", userCenter);
    }
  }, [userCenter, showUserLocation]);

  const directionsCallback = useCallback((res) => {
    if (res !== null) {
      if (res.status === 'OK') {
        setResponse(res);
      } else {
        console.error('Error fetching directions:', res);
      }
    }
  }, []);

  // 定位到使用者位置的按鈕點擊處理
  const handleUserLocationClick = () => {
    handleCurrentLocationClick(); // 呼叫傳入的函數來獲取使用者目前位置
    setShowUserLocation(true);
  };

  return (
    <div className="map-container">
      <button className="locate-button" onClick={handleUserLocationClick}>
        定位到目前位置
      </button>
      <LoadScript googleMapsApiKey="AIzaSyCdWI-xZcUwjBPA4tMOjdDwaKZE-JhuNd4">
        <GoogleMap
          mapContainerStyle={mapStyles} // 使用定義好的 mapStyles
          center={mapCenter} // 根據 mapCenter 動態設置地圖中心
          zoom={14}
          onLoad={() => console.log('Google Map Loaded')}
          options={{
            zoomControl: true,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          }}
        >
          {/* 只有當使用者點擊按鈕後才顯示使用者當前位置的標記 */}
          {showUserLocation && userCenter && (
            <Marker 
              position={userCenter} 
              label="使用者位置" 
              onClick={() => console.log('使用者位置標記點擊')} 
            />
          )}

          {/* 顯示自定義標記位置 */}
          {customLocations.map((location, index) => (
            <Marker
              key={index}
              position={{ lat: location.lat, lng: location.lng }}
              label={location.label}
              onClick={() => {
                setSelectedLocation(location);
                console.log('選中標記:', location); // 檢查選中的標記
              }}
            />
          ))}

          {/* 如果選中了一個標記，顯示其資料的 InfoWindow */}
          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              onCloseClick={() => setSelectedLocation(null)} // 關閉 InfoWindow 時清除選中位置
            >
              <div>
                <h4>{selectedLocation.label}</h4>
                <p>{selectedLocation.data}</p>
              </div>
            </InfoWindow>
          )}

          {/* 如果有當前位置和目的地，且尚未獲得路線回應，請求路線服務 */}
          {currentPosition && destination && !response && (
            <DirectionsService
              options={{
                origin: currentPosition,
                destination: destination,
                travelMode: 'WALKING',
              }}
              callback={directionsCallback}
            />
          )}

          {/* 如果獲得了路線回應，則在地圖上顯示路線 */}
          {response && (
            <DirectionsRenderer
              options={{
                directions: response,
                draggable: true,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
});

export default MapContainer;
