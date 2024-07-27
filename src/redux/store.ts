import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // [apiSlice.reducerPath]: apiSlice.reducer,  
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch