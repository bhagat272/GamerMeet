import {combineReducers} from '@reduxjs/toolkit';

import loading from './loadingReducer';
import session from './userSessionReducer';
import location from './locationReducer';
import refresh from './refreshReducer';
import initialTab from './tabReducer';
import chat from './chatReducer';

export default combineReducers({
  loading,
  session,
  location,
  refresh,
  initialTab,
  chat,
});
