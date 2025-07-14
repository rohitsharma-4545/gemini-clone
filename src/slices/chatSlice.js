import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  chatrooms: [], // {id, title, createdAt}
  currentChatroomId: null,
  messages: {}, // { [chatroomId]: [{id, sender, text, timestamp, image}] }
  pagination: {}, // { [chatroomId]: { page: 1, hasMore: true } }
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createChatroom(state, action) {
      const id = nanoid();
      state.chatrooms.push({ id, title: action.payload, createdAt: Date.now() });
      state.messages[id] = [];
      state.pagination[id] = { page: 1, hasMore: true };
      state.currentChatroomId = id;
    },
    deleteChatroom(state, action) {
      const id = action.payload;
      state.chatrooms = state.chatrooms.filter(room => room.id !== id);
      delete state.messages[id];
      delete state.pagination[id];
      if (state.currentChatroomId === id) {
        state.currentChatroomId = state.chatrooms.length ? state.chatrooms[0].id : null;
      }
    },
    setCurrentChatroom(state, action) {
      state.currentChatroomId = action.payload;
    },
    addMessage(state, action) {
      const { chatroomId, message } = action.payload;
      if (!state.messages[chatroomId]) state.messages[chatroomId] = [];
      state.messages[chatroomId].push(message);
    },
    updateChatroomTitle(state, action) {
      const { chatroomId, title } = action.payload;
      const room = state.chatrooms.find(r => r.id === chatroomId);
      if (room) room.title = title;
    },
    paginateMessages(state, action) {
      const { chatroomId, messages, page, hasMore } = action.payload;
      if (!state.messages[chatroomId]) state.messages[chatroomId] = [];
      state.messages[chatroomId] = [...messages, ...state.messages[chatroomId]];
      state.pagination[chatroomId] = { page, hasMore };
    },
    resetChat(state) {
      return initialState;
    },
  },
});

export const {
  createChatroom,
  deleteChatroom,
  setCurrentChatroom,
  addMessage,
  updateChatroomTitle,
  paginateMessages,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer; 