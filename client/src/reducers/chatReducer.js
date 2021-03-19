import {
  GET_ALL_USERS,
  GET_ALL_CHATS,
  SET_LOADING_USERS,
  SET_LOADING_CHATS,
  SET_LOADING_CURRENT_CHAT,
  SET_LOADING_ANONS,
  NEW_CHAT_CREATED,
  GET_CURRENT_CHAT,
  CREATE_MESSAGE,
  EDIT_MESSAGE,
  DELETE_MESSAGE,
  GET_ANONS,
  ADD_ANONS
} from '../actions/types';

const initialState = {
  users: [],
  chats: [],
  hasChatWith: [],
  notHaveChatWith: [],
  currentChat: {
    user1: {},
    user2: {},
    messages: []
  },
  anons: [],
  loadingUsers: false,
  loadingChats: false,
  loadingCurrentChat: false,
  loadingAnons: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOADING_USERS:
      return {
        ...state,
        loadingUsers: true
      };

    case SET_LOADING_CHATS:
      return {
        ...state,
        loadingChats: true
      };

    case SET_LOADING_CURRENT_CHAT:
      return {
        ...state,
        loadingCurrentChat: true
      };

    case SET_LOADING_ANONS:
      return {
        ...state,
        loadingAnons: true
      };

    case GET_ALL_USERS:
      return {
        ...state,
        users: action.payload.data,
        loadingUsers: false
      };

    case GET_ALL_CHATS:
      return {
        ...state,
        chats: action.payload.chats,
        hasChatWith: action.payload.hasChatWith,
        notHaveChatWith: action.payload.notHaveChatWith,
        loadingChats: false
      };

    case GET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: action.payload,
        loadingCurrentChat: false
      };

    case NEW_CHAT_CREATED:
      return {
        ...state,
        chats: [...state.chats, action.payload]
      };

    case CREATE_MESSAGE:
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          messages: [...state.currentChat.messages, action.payload]
        }
      };

    case EDIT_MESSAGE:
      let index = state.currentChat.messages.findIndex(item => item._id.toString() === action.payload.messageId);
      let messages = [...state.currentChat.messages];
      messages[index] = { ...state.currentChat.messages[index], body: action.payload.updatedBody }
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          messages: messages
        }
      };

    case DELETE_MESSAGE:
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          messages: state.currentChat.messages.filter(item => item._id.toString() !== action.payload.messageId)
        }
      };

    case GET_ANONS:
      return {
        ...state,
        anons: action.payload,
        loadingAnons: false
      };

    case ADD_ANONS:
      return {
        ...state,
        anons: [...state.anons, action.payload],
      };

    default:
      return state;
  }
};