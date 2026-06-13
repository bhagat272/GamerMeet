import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface LocationState {
  address: string;
  latitude: string;
  longitude: string;
  isFirstLoad: boolean;
}

const initialState: LocationState = {
  address: '',
  latitude: '',
  longitude: '',
  isFirstLoad: true, // Set to true initially
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<LocationState>) {
      state.address = action.payload.address;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.isFirstLoad = false;
    },
    resetFirstLoad(state) {
      state.isFirstLoad = true;
    },
  },
});

export const {setLocation, resetFirstLoad} = locationSlice.actions;
export default locationSlice.reducer;
