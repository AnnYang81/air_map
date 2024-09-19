export const initialState = {
  val1: '',
  val2: '',
  prevVal1: '',
  prevVal2: '',
  userCenter: null,
  currentPosition: null,
  destination: null,
};

export const useLocationState = (setState) => {
  return {
    setVal1: (val) => setState(prevState => ({ ...prevState, val1: val })),
    setVal2: (val) => setState(prevState => ({ ...prevState, val2: val })),
    setUserCenter: (center) => setState(prevState => ({ ...prevState, userCenter: center })),
    setCurrentPosition: (position) => setState(prevState => ({ ...prevState, currentPosition: position })),
    setDestination: (destination) => setState(prevState => ({ ...prevState, destination })),
  };
};
