  import React, { useState, useCallback, useEffect, useMemo } from 'react';
  import { debounce } from 'lodash';
  import MapComponent from './MapComponent'; // 假設這是您的地圖組件

  const YourComponent = () => {
    const [state, setState] = useState({
      val1: '',
      val2: '',
      prevVal1: '',
      prevVal2: ''
    });

    const handleSearchLocation = (address, setPosition) => {
      // 處理搜尋位置的邏輯
    };

    const debouncedSearchLocation = useCallback(
      debounce((address, setPosition) => handleSearchLocation(address, setPosition), 500),
      []
    );

    const handleSearchClick = useCallback(() => {
      if (state.val1 !== state.prevVal1 || state.val2 !== state.prevVal2) {
        debouncedSearchLocation(state.val1, locationActions.setCurrentPosition);
        debouncedSearchLocation(state.val2, locationActions.setDestination);
        // 其他邏輯
      }
    }, [state.val1, state.val2, state.prevVal1, state.prevVal2]);

    useEffect(() => {
      // 更新 DirectionsRenderer
      if (directions) {
        directionsRenderer.setDirections(directions);
      }
    }, [directions]);

    return (
      <div>
        <MapComponent mapOptions={mapOptions} onMapLoad={handleMapLoad} />
        <button onClick={handleSearchClick}>搜尋</button>
        {/* 其他組件 */}
      </div>
    );
  };

  export default MyComponent;
