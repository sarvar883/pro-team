import axios from 'axios';
import {
  GET_ALL_USERS,
  GET_ERRORS,
  SET_LOADING_USERS,
  SET_LOADING_CHATS,
  SET_LOADING_CURRENT_CHAT,
  SET_LOADING_ANONS,
  NEW_CHAT_CREATED,
  GET_ALL_CHATS,
  GET_CURRENT_CHAT,
  GET_ANONS,
  CREATE_MESSAGE,
  EDIT_MESSAGE,
  DELETE_MESSAGE,
  ADD_ANONS
} from './types';


export const getAllUsers = () => (dispatch) => {
  dispatch(setLoadingUsers());

  const object = {
    method: 'all',
    roles: []
  };

  // axios.get('/chat/get-all-users')
  axios.post('/get-users', { object })
    .then(users =>
      dispatch({
        type: GET_ALL_USERS,
        payload: users
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getAllChatsOfUser = (userId) => (dispatch) => {
  dispatch(setLoadingChats());
  axios.post('/chat/get-all-chats-of-user', { userId: userId })
    .then(res =>
      dispatch({
        type: GET_ALL_CHATS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


// create new chat between 2 people
export const createChat = (newChat, history) => (dispatch) => {
  axios.post('/chat/createChat', newChat)
    .then(res =>
      dispatch({
        type: NEW_CHAT_CREATED,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getCurrentChat = (chatId) => (dispatch) => {
  dispatch(setLoadingCurrentChat());
  axios.get(`/chat/${chatId}`)
    .then(res =>
      dispatch({
        type: GET_CURRENT_CHAT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const createMessage = (object) => (dispatch) => {
  axios.post('/chat/create-message', { object: object })
    .then(res => {
      dispatch({
        type: CREATE_MESSAGE,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const deleteMessage = (chatId, messageId) => (dispatch) => {
  axios.post('/chat/delete-message', { chatId: chatId, messageId: messageId })
    .then(res =>
      dispatch({
        type: DELETE_MESSAGE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const editMessage = (object) => (dispatch) => {
  axios.post('/chat/edit-message', { object: object })
    .then(res =>
      dispatch({
        type: EDIT_MESSAGE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


// get announcements
export const getAllAnons = () => (dispatch) => {
  dispatch(setLoadingAnons());
  axios.post('/chat/get-all-anons')
    .then(res =>
      dispatch({
        type: GET_ANONS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


// add an announcement
export const addAnons = (object, history) => (dispatch) => {
  axios.post('/chat/create-announcement', { object: object })
    .then(res =>
      dispatch({
        type: ADD_ANONS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


// Loading all users
export const setLoadingUsers = () => {
  return {
    type: SET_LOADING_USERS
  };
};


// Loading all chats
export const setLoadingChats = () => {
  return {
    type: SET_LOADING_CHATS
  };
};


// Loading current chat
export const setLoadingCurrentChat = () => {
  return {
    type: SET_LOADING_CURRENT_CHAT
  };
};


// Loading announcements
export const setLoadingAnons = () => {
  return {
    type: SET_LOADING_ANONS
  };
};