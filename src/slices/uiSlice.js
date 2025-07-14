import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: false,
  loading: false,
  toast: null, // { type, message }
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    setDarkMode(state, action) {
      state.darkMode = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    showToast(state, action) {
      state.toast = action.payload;
    },
    hideToast(state) {
      state.toast = null;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  setLoading,
  showToast,
  hideToast,
  setSearchQuery,
} = uiSlice.actions;

export default uiSlice.reducer; 