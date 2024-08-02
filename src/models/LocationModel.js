export const initialState = {
    val1: '請輸入出發地：',
    val2: '請輸入目的地：',
    userCenter: null,
    currentPosition: null,
    destination: null
  };
  
  export const useLocationState = (setState) => ({
    setVal1: (value) => setState(prevState => ({ ...prevState, val1: value })),
    setVal2: (value) => setState(prevState => ({ ...prevState, val2: value })),
    setUserCenter: (position) => setState(prevState => ({ ...prevState, userCenter: position })),
    setCurrentPosition: (position) => setState(prevState => ({ ...prevState, currentPosition: position })),
    setDestination: (position) => setState(prevState => ({ ...prevState, destination: position })),
  });
  