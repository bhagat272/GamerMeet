import {createSlice} from '@reduxjs/toolkit';

interface RefreshState {
  refreshFlag: boolean;
  refreshChatList: boolean;
}

const initialState: RefreshState = {
  refreshFlag: false,
  refreshChatList: true,
};

const refreshSlice = createSlice({
  name: 'refresh',
  initialState,
  reducers: {
    triggerRefresh: state => {
      state.refreshFlag = !state.refreshFlag; // toggle to force refresh
    },
    resetRefresh: state => {
      state.refreshFlag = false;
    },
    triggerChatList: state => {
      state.refreshChatList = true;
    },
    resetChatlist: state => {
      state.refreshChatList = false;
    },
  },
});

export const {triggerRefresh, resetRefresh, triggerChatList, resetChatlist} =
  refreshSlice.actions;

export default refreshSlice.reducer;
