import axios from 'axios';

import {
  SET_FAILED_ORDER,
  SET_FAIL_SEARCH_VARS,
  GET_FAILED_ORDERS,
  SET_LOADING_FAILED_ORDER,
  DELETE_QUERY_FROM_STATE,

  GET_ERRORS
} from './types';


export const setFailedOrder = (order) => (dispatch) => {
  dispatch({
    type: SET_FAILED_ORDER,
    payload: order
  });
};


export const getFailOrderById = (id) => async (dispatch) => {
  dispatch({
    type: SET_LOADING_FAILED_ORDER
  });

  try {
    const res = await axios.post('/order/get-order-by-id', { id });

    dispatch({
      type: SET_FAILED_ORDER,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
      // payload: err
    });
  }
};


export const createOrderAfterFail = (object, history, occupation) => async (dispatch) => {
  // delete query from global state because the query should not stay in queries page
  // to do: check if user is accountant or admin and dispatch different types
  dispatch({
    type: DELETE_QUERY_FROM_STATE,
    payload: object.failedOrder._id
  });

  // console.log('order', object);
  axios.post('/fail/create-new-after-fail', { object })
    .then(() => {
      let addressToRedirect = '';

      if (occupation === 'admin' || occupation === 'accountant') {
        // because we do not have /admin/order-queries route for admin
        addressToRedirect = `/${occupation}`;
      } else {
        addressToRedirect = `/${occupation}/order-queries`;
      }

      // clearSortedOrders(dispatch);

      return history.push(addressToRedirect);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


// вытащить из БД некачественные и повторные заказы !!
export const getFailedOrders = (object) => async (dispatch) => {
  dispatch({
    type: SET_LOADING_FAILED_ORDER
  });

  dispatch({
    type: SET_FAIL_SEARCH_VARS,
    payload: object
  });

  try {
    const res = await axios.post('/fail/get-failed-orders', { object });

    dispatch({
      type: GET_FAILED_ORDERS,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
      // payload: err
    });
  }
};