/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Create a Redux slice for authentication
const authSlice = createSlice({
  name: 'auth',
  initialState: { isLoggedIn: false }, // Initial state with isLoggedIn set to false
  reducers: {
    setLoggedIn(state) {
      state.isLoggedIn = true; // Reducer function to set isLoggedIn to true
    },
    setLoggedOut(state) {
      state.isLoggedIn = false; // Reducer function to set isLoggedIn to false
    },
  },
});

// Configuration object for redux-persist
const persistConfig = {
  key: 'root', // Key to identify the persisted state
  storage, // Storage mechanism (in this case, browser's local storage)
};

// Created a persisted reducer by combining the authSlice.reducer with persistConfig
const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

// Exported the action creators generated by authSlice.actions
export const authActions = authSlice.actions;

// Created the Redux store with the persistedReducer
export const store = configureStore({
  reducer: persistedReducer,
});

// Created a persistor to persist the store's state
export const persistor = persistStore(store);
