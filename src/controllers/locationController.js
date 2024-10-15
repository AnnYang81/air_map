export const handleSearchLocation = async (query, setLocation) => {
  // 使用 Google Maps Geocoding API 搜尋位置
  const geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({ address: query }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const location = results[0].geometry.location;
      setLocation({ lat: location.lat(), lng: location.lng() });
    } else {
      console.error('Geocode was not successful for the following reason: ' + status);
    }
  });
};

export const handleCurrentLocationClick = (setCurrentPosition) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setCurrentPosition(currentPosition);
    },
    (error) => {
      console.error('定位錯誤:', error);
      alert('無法獲取當前位置。請確保允許定位服務。');
    }
  );
};

export const handleSwap = (state, setState) => {
  const temp = state.val1;
  setState({
    ...state,
    val1: state.val2,
    val2: temp
  });
};
