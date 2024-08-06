import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const MapContainer = React.memo(({
  mapContainerStyle,
  userCenter,
  currentPosition,
  destination,
  handleCurrentLocationClick
}) => {
  const [response, setResponse] = useState(null);

  const directionsCallback = useCallback((res) => {
    if (res !== null) {
      if (res.status === 'OK') {
        setResponse(res);
      } else {
        console.error('Error fetching directions', res);
      }
    }
  }, []);

  const mapCenter = useMemo(() => userCenter || { lat: 25.0330, lng: 121.5654 }, [userCenter]); // 如果沒有獲取到使用者位置則使用台北市中心

  return (
    <div className="map-container">
      <button className="locate-button" onClick={handleCurrentLocationClick}>
        定位到目前位置
      </button>
      <LoadScript googleMapsApiKey="AIzaSyBbaRZlyvFaqVmf5QKfLHGQtJzz4RR46d">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={18}
          options={{
            zoomControl: true,
            mapTypeControl: true, // 啟用地圖類型切換控件
            streetViewControl: true, // 啟用街景控件
            fullscreenControl: true // 啟用全屏控件
          }}
        >
          {userCenter && <Marker position={userCenter} />}
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

          {response && (
            <DirectionsRenderer
              options={{
                directions: response,
                draggable: true, // 允許用戶拖動路線
                // polylineOptions: {
                //   strokeColor: 'red' // 可選：設置路線顏色
                // },
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
});

export default MapContainer;
