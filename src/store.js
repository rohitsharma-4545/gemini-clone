import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';

// LocalStorage persistence helpers
const PERSIST_KEY = 'gemini_clone_state';
function loadState() {
  try {
    const serialized = localStorage.getItem(PERSIST_KEY);
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch {
    return undefined;
  }
}
function saveState(state) {
  try {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
  } catch { }
}

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
  preloadedState: loadState(),
});

// Debounced save to localStorage
let saveTimeout;
store.subscribe(() => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveState(store.getState());
  }, 300);
});

export default store; 