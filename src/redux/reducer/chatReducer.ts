import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ChatState {
  otherUserInfo: any | null;
}

const initialState: ChatState = {
  otherUserInfo: null,
};

const chatReducer = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setOtherUserInfo(state, action: PayloadAction<any>) {
      state.otherUserInfo = action.payload;
    },
    clearOtherUserInfo(state) {
      state.otherUserInfo = null;
    },
  },
});

export const {setOtherUserInfo, clearOtherUserInfo} = chatReducer.actions;
export default chatReducer.reducer;
