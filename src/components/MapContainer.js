import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapContainer = ({
  mapContainerStyle,
  userCenter,
  currentPosition,
  destination,
  handleCurrentLocationClick
}) => (
  <div className="map-container">
    <button className="locate-button" onClick={handleCurrentLocationClick}>
      定位到目前位置
    </button>
    <LoadScript googleMapsApiKey="AIzaSyBbaRZlyvFaqVmf5QKfLHGQtJzz4RR46dw">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userCenter || { lat: 25.0330, lng: 121.5654 }}
        zoom={10}
      >
        {userCenter && <Marker position={userCenter} />}
        {currentPosition && <Marker position={currentPosition} />}
        {destination && <Marker position={destination} />}
      </GoogleMap>
    </LoadScript>
  </div>
);

export default MapContainer;