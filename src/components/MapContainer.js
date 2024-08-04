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

  const mapCenter = useMemo(() => userCenter || { lat: 25.0330, lng: 121.5654 }, [userCenter]);

  return (
    <div className="map-container">
      <button className="locate-button" onClick={handleCurrentLocationClick}>
        定位到目前位置
      </button>
      <LoadScript googleMapsApiKey="AIzaSyBbaRZlyvFaqVmf5QKfLHGQtJzz4RR46d">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={21}
          options={{
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          }}
        >
          {userCenter && <Marker position={userCenter} />}
          {currentPosition && (
            <Marker 
              position={currentPosition} 
            />
          )}
          {destination && <Marker position={destination} />}

          {currentPosition && destination && !response && (
            <DirectionsService
              options={{
                origin: currentPosition,
                destination: destination,
                travelMode: 'DRIVING',
              }}
              callback={directionsCallback}
            />
          )}

          {response && (
            <DirectionsRenderer
              options={{
                directions: response,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
});

export default MapContainer;
