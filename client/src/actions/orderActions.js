import axios from 'axios';
import {
  CORPORATE_CLIENTS,
  GET_ALL_USERS,
  GET_DISINFECTORS,
  SET_LOADING,
  SET_LOADING_REPEAT_ORDER,
  GET_ERRORS,
  GET_ALL_ORDERS,
  GET_ORDER_BY_ID,
  SEARCH_ORDERS,
  SET_SEARCH_ORDER_METHOD,
  GET_REPEAT_ORDER_FORM,
  GET_COMPLETE_ORDERS_IN_MONTH,
  SET_COMP_ORDER_METHOD_INPUT
} from './types';


// get corporate clients
export const getCorporateClients = () => (dispatch) => {
  axios.post('/order/get-corporate-clients')
    .then(res =>
      dispatch({
        type: CORPORATE_CLIENTS,
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


// get all users
export const getAllUsers = () => (dispatch) => {
  dispatch(setLoading());
  axios.post('/order/get-all-users')
    .then(res =>
      dispatch({
        type: GET_ALL_USERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
}


// get all disinfectors
export const getDisinfectors = () => (dispatch) => {
  dispatch(setLoading());
  axios
    .get('/order/get-all-disinfectors')
    .then(res => {
      dispatch({
        type: GET_DISINFECTORS,
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


// create new order
export const createOrder = (newOrder, history, occupation) => (dispatch) => {
  axios.post('/order/create-order', newOrder)
    .then(res => history.push(`/${occupation}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// get order to create repeated order
export const getRepeatOrderForm = (id) => (dispatch) => {
  dispatch(setLoadingRepeatOrder());
  axios.post('/operator/repeat-order-form', { id: id })
    .then(res =>
      dispatch({
        type: GET_REPEAT_ORDER_FORM,
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

export const createRepeatOrder = (order, history, occupation) => (dispatch) => {
  axios.post('/order/create-repeat-order', { order: order })
    .then(() => history.push(`/${occupation}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// edit order
export const getOrderForEdit = (id) => (dispatch) => {
  dispatch(setLoading());
  axios.post('/order/get-order-by-id', { id: id })
    .then(res =>
      dispatch({
        type: GET_ORDER_BY_ID,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// edit order
export const editOrder = (order, history, occupation) => (dispatch) => {
  axios.post('/order/edit', { order: order })
    .then(res => history.push(`/${occupation}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


// delete order
export const deleteOrder = (object, history, occupation) => (dispatch) => {
  axios.post('/order/delete-order', { object: object })
    .then(result => history.push(`/${occupation}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// get orders for logged in disinfector
export const getOrders = (userId) => (dispatch) => {
  dispatch(setLoading());
  axios.post('/order/get-my-orders', { userId: userId })
    .then(res =>
      dispatch({
        type: GET_ALL_ORDERS,
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


// add disinfector comment to order
export const addDisinfectorComment = (object, history, occupation) => (dispatch) => {
  axios.post('/order/addDisinfectorComment', object)
    .then(res => history.push(`/${occupation}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


// get one order by id
export const getOrderById = (id) => (dispatch) => {
  dispatch(setLoading());
  axios.post('/order/get-order-by-id', { id: id })
    .then(res =>
      dispatch({
        type: GET_ORDER_BY_ID,
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


// search orders
export const searchOrders = (object) => (dispatch) => {
  dispatch(setLoading());

  // search search method and search input value
  dispatch(setSearchOrderMethod(object));

  axios.post('/order/search-orders', { object: object })
    .then(res =>
      dispatch({
        type: SEARCH_ORDERS,
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


// submit completed order
export const submitCompleteOrder = (object, history, occupation) => (dispatch) => {
  axios.post('/order/submit-complete-order', { order: object })
    .then(() => history.push(`/${occupation}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// disinfectors gets his completed orders for some month
export const getCompleteOrdersInMonth = (object) => (dispatch) => {
  dispatch({
    type: SET_COMP_ORDER_METHOD_INPUT,
    payload: object
  });

  dispatch(setLoading());
  axios.post('/order/get-complete-order-in-month', { object })
    .then(res =>
      dispatch({
        type: GET_COMPLETE_ORDERS_IN_MONTH,
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


// set search order method and input
export const setSearchOrderMethod = (object) => {
  return {
    type: SET_SEARCH_ORDER_METHOD,
    payload: object
  };
};


// Disinfector loading
export const setLoading = () => {
  return {
    type: SET_LOADING
  };
};

export const setLoadingRepeatOrder = () => {
  return {
    type: SET_LOADING_REPEAT_ORDER
  };
}