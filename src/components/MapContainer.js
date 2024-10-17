import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer, InfoWindow, Circle } from '@react-google-maps/api';

const MapContainer = React.memo(({ userCenter, currentPosition, destination, handleCurrentLocationClick }) => {
  const [response, setResponse] = useState(null);
  const [customLocations, setCustomLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 25.0330, lng: 121.5654 });
  const [poorQualityAreas, setPoorQualityAreas] = useState([
    {
      location: "北護C棟宿舍",
      latitude: 25.118751,
      longitude: 121.518986,
      PM2_5: 120
    },
    {
      location: "北護校門口",
      latitude: 25.11448123192722,
      longitude: 121.51598878198111,
      PM2_5: 110
    }
  ]);
  const [selectedRouteInfo, setSelectedRouteInfo] = useState([]);
  const [isCalculatingRoutes, setIsCalculatingRoutes] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);

  const mapStyles = {
    width: '100%',
    height: '530px',
  };

  const handleMapLoad = useCallback((map) => {
    console.log("Google Map 已經加載");
    // 確保地圖顯示所有的危險區域
    const bounds = new window.google.maps.LatLngBounds();
    poorQualityAreas.forEach(area => {
      bounds.extend(new window.google.maps.LatLng(area.latitude, area.longitude));
    });
    map.fitBounds(bounds);
  }, [poorQualityAreas]);

  useEffect(() => {
    console.log("組件已掛載，poorQualityAreas:", poorQualityAreas);
  }, [poorQualityAreas]);
  

  useEffect(() => {
    const savedLocations = JSON.parse(localStorage.getItem('customLocations'));
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
    }
  }, []);

  const directionsCallback = useCallback((res) => {
    if (res !== null && res.status === 'OK' && !isCalculatingRoutes) {
      console.log('獲得的路徑回應:', res);
      setResponse(res);
      setIsCalculatingRoutes(true);

      if (poorQualityAreas.length > 0) {
        calculateOverlapWithHazardAreas(res.routes);
      } else {
        console.log('沒有可用的危險區域進行覆蓋計算');
        setIsCalculatingRoutes(false);
      }
    } else if (res && res.status !== 'OK') {
      console.error('Error fetching directions:', res);
      setIsCalculatingRoutes(false);
    }
  }, [poorQualityAreas, isCalculatingRoutes]);

  const calculateOverlapWithHazardAreas = (routes) => {
    if (!routes || !poorQualityAreas.length) {
      console.log('沒有可用的路徑或危險區域');
      setIsCalculatingRoutes(false);
      return;
    }

    const newRouteInfo = routes.map((route, routeIndex) => {
      let overlapDistance = 0;
      let totalDistance = 0;

      const path = route.overview_path;
      const duration = route.legs[0]?.duration?.text; // 獲取行走時間

      if (!path) {
        console.log(`路徑 ${routeIndex + 1} 沒有 overview_path`);
        return null;
      }

      for (let i = 0; i < path.length - 1; i++) {
        const pointStart = { lat: path[i].lat(), lng: path[i].lng() };
        const pointEnd = { lat: path[i + 1].lat(), lng: path[i + 1].lng() };

        const stepDistance = haversineDistance(pointStart, pointEnd);
        totalDistance += stepDistance;

        poorQualityAreas.forEach(area => {
          const hazardCenter = { lat: area.latitude, lng: area.longitude };
          const distanceStartToHazard = haversineDistance(pointStart, hazardCenter);
          const distanceEndToHazard = haversineDistance(pointEnd, hazardCenter);

          if (distanceStartToHazard <= 30 || distanceEndToHazard <= 30) {
            overlapDistance += stepDistance;
          }
        });
      }

      if (totalDistance > 0) {
        const overlapRatio = (overlapDistance / totalDistance) * 100;
        console.log(`路徑 ${routeIndex + 1} 與危險區域的覆蓋距離：${overlapDistance.toFixed(2)} 公尺`);
        console.log(`路徑 ${routeIndex + 1} 的覆蓋比例：${overlapRatio.toFixed(2)}%`);

        return {
          index: routeIndex,
          overlapDistance: overlapDistance.toFixed(2),
          overlapRatio: overlapRatio.toFixed(2),
          position: path[Math.floor(path.length / 2)],
          showInfo: true,  // Always set to true, we'll control visibility elsewhere
          duration: duration // 加入行走時間資訊
        };
      } else {
        console.log(`路徑 ${routeIndex + 1} 的總距離為0`);
        return null;
      }
    }).filter(info => info !== null);

    setSelectedRouteInfo(newRouteInfo);
    setIsCalculatingRoutes(false);

    console.log(`顯示空汙覆蓋資訊的 InfoWindow 總共有 ${newRouteInfo.length} 個`);
  };

  const haversineDistance = (coords1, coords2) => {
    const R = 6371e3;
    const φ1 = (coords1.lat * Math.PI) / 180;
    const φ2 = (coords2.lat * Math.PI) / 180;
    const Δφ = ((coords2.lat - coords1.lat) * Math.PI) / 180;
    const Δλ = ((coords2.lng - coords1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return (
    <div className="map-container">
      <button className="locate-button" onClick={handleCurrentLocationClick}>
        定位到目前位置
      </button>
      <LoadScript googleMapsApiKey="AIzaSyCdWI-xZcUwjBPA4tMOjdDwaKZE-JhuNd4">
        <GoogleMap
          mapContainerStyle={mapStyles}
          center={mapCenter}
          zoom={14}
          onLoad={handleMapLoad}
          options={{
            zoomControl: true,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          }}
        >
          {/* {showUserLocation && userCenter && (
            <Marker
              position={userCenter}
              label="使用者位置"
            />
          )} */}

          {customLocations.map((location, index) => (
            <Marker
              key={index}
              position={{ lat: location.lat, lng: location.lng }}
              label={location.label}
              onClick={() => {
                setSelectedLocation(location);
              }}
            />
          ))}

          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div>
                <h4>{selectedLocation.label}</h4>
                <p>{selectedLocation.data}</p>
              </div>
            </InfoWindow>
          )}

          {poorQualityAreas.map((area, index) => (
            <React.Fragment key={index}>
              <Circle
                center={{ lat: area.latitude, lng: area.longitude }}
                options={{
                  radius: 30,
                  fillColor: '#ffcf39',
                  fillOpacity: 0.35,
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.8,
                  strokeWeight: 1,
                }}
              />
              <Marker
                position={{ lat: area.latitude, lng: area.longitude }}
                icon={{
                  path: window.google && window.google.maps ? window.google.maps.SymbolPath.CIRCLE : '',
                  scale: 6,
                  fillColor: '#FF0000',
                  fillOpacity: 1,
                  strokeWeight: 0,
                }}
              />
            </React.Fragment>
          ))}

          {currentPosition && destination && !response && !isCalculatingRoutes && (
            <DirectionsService
              options={{
                origin: currentPosition,
                destination: destination,
                travelMode: 'WALKING',
                provideRouteAlternatives: true,
              }}
              callback={directionsCallback}
            />
          )}

          {response && selectedRouteIndex !== null && (
            <DirectionsRenderer
              options={{
                directions: response,
                routeIndex: selectedRouteIndex,
                draggable: true,
                polylineOptions: {
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.7,
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {selectedRouteInfo.map((info, index) => (
            (selectedRouteIndex === null || selectedRouteIndex === info.index) && info.showInfo && (
              <InfoWindow
                key={`route-info-${index}`}
                position={{ lat: info.position.lat(), lng: info.position.lng() }}
                onCloseClick={() => {
                  setSelectedRouteInfo(prevInfo =>
                    prevInfo.map(routeInfo =>
                      routeInfo.index === info.index ? { ...routeInfo, showInfo: false } : routeInfo
                    )
                  );
                }}
              >
                <div>
                  <h4>路徑 {info.index + 1} 的空汙覆蓋資訊</h4>
                  <p>空汙覆蓋距離：{info.overlapDistance} 公尺</p>
                  <p>空汙覆蓋比例：{info.overlapRatio}%</p>
                  {info.duration && <p>預計行走時間：{info.duration}</p>}
                  <button
                    onClick={() => {
                      // 關閉所有的 InfoWindow
                      setSelectedRouteInfo(prevInfo =>
                        prevInfo.map(routeInfo =>
                          ({ ...routeInfo, showInfo: false })
                        )
                      );

                      // 更新 response 為只包含被選中的路徑
                      setResponse(prevResponse => ({
                        ...prevResponse,
                        routes: [prevResponse.routes[info.index]],
                      }));

                      // 更新選擇的路徑索引
                      setSelectedRouteIndex(0); // 這裡設置為 0，因為只保留了一條路徑
                    }}
                    style={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      padding: '10px 15px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    選擇此路徑
                  </button>

                </div>
              </InfoWindow>
            )
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
});

export default MapContainer;
