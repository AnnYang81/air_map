import Swal from 'sweetalert2';

const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

export const handleSwap = (state, setState) => {
  const temp = state.val1;
  setState({
    ...state,
    val1: state.val2,
    val2: temp
  });
};

export const handleSearchLocation = (address, setPosition) => {
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

  fetch(`${GEOCODING_API_URL}?address=${encodeURIComponent(address)}&key=AIzaSyBbaRZlyvFaqVmf5QKfLHGQtJzz4RR46d`)
    .then(response => response.json())
    .then(data => {
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
      Swal.fire({
        position: 'middle',
        text: '找不到地址，請重新輸入',
        icon: 'error',
        showCloseButton: true,
        showConfirmButton: false
      });
    });
};

export const handleCurrentLocationClick = (setCurrentPosition) => {
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
