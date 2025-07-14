import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  country: null,
  phone: '',
  otpSent: false,
  otpVerified: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCountry(state, action) {
      state.country = action.payload;
    },
    setPhone(state, action) {
      state.phone = action.payload;
    },
    sendOtpStart(state) {
      state.loading = true;
      state.error = null;
    },
    sendOtpSuccess(state) {
      state.otpSent = true;
      state.loading = false;
    },
    sendOtpFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    verifyOtpStart(state) {
      state.loading = true;
      state.error = null;
    },
    verifyOtpSuccess(state, action) {
      state.otpVerified = true;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
    },
    verifyOtpFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      return initialState;
    },
  },
});

export const {
  setCountry,
  setPhone,
  sendOtpStart,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer; 