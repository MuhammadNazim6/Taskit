import { createSlice } from "@reduxjs/toolkit";

const userInfoFromLocalStorage = localStorage.getItem('taskUserInfo');
const initialState = {
  taskUserLoggedIn: localStorage.getItem('taskUserLoggedIn') ? true : false,
  taskUserInfo: userInfoFromLocalStorage ? JSON.parse(userInfoFromLocalStorage) : null
}

const authSlice = createSlice({
  name: 'taskAuth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.taskUserLoggedIn = true
      localStorage.setItem('taskUserLoggedIn', 'true')
      state.taskUserInfo = action.payload;
      localStorage.setItem('taskUserInfo', JSON.stringify(action.payload));
    },
    userLogout: (state) => {
      state.taskUserLoggedIn = false;
      state.taskUserInfo = null;
      localStorage.removeItem('taskUserLoggedIn')
      localStorage.removeItem('taskUserInfo')
    },
  }
})

export const {
  setCredentials,
  userLogout,
} = authSlice.actions;

export default authSlice.reducer;