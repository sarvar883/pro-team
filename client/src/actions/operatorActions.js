import axios from 'axios';
import {
  GET_ERRORS,
  GET_SORTED_ORDERS,
  GET_NOT_COMPLETED_ORDERS,
  GET_COMPLETE_ORDERS,
  GET_COMPLETE_ORDER_BY_ID,
  DELETE_QUERY_FROM_STATE,
  GOT_STATS_FOR_OPERATOR,
  GET_REPEAT_ORDERS,
  SET_REPEAT_ORDER_SEARCH_VARS,
  SET_LOADING_SORTED_ORDERS,
  SET_LOADING_COMPLETE_ORDERS,
  SET_LOADING_OPERATOR_STATS
} from './types';


export const getSortedOrders = (date) => (dispatch) => {
  dispatch(setLoadingSortedOrders());
  axios.post('/operator/get-sorted-orders', { date: date })
    .then(res =>
      dispatch({
        type: GET_SORTED_ORDERS,
        payload: res.data,
        date: date
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


// operator gets complete orders for confirmation
export const getCompleteOrders = (id) => (dispatch) => {
  dispatch(setLoadingCompleteOrders());
  axios.post('/operator/get-complete-orders', { id: id })
    .then(res =>
      dispatch({
        type: GET_COMPLETE_ORDERS,
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


export const getCompleteOrderById = (id) => (dispatch) => {
  dispatch(setLoadingCompleteOrders());
  axios.post(`/operator/get-complete-order-by-id/${id}`)
    .then(res =>
      dispatch({
        type: GET_COMPLETE_ORDER_BY_ID,
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


// operator confirms completed order
export const confirmCompleteOrder = (object, history) => (dispatch) => {
  // delete query from global state because the query should not stay in queries page
  dispatch({
    type: DELETE_QUERY_FROM_STATE,
    payload: object.orderId
  });

  axios.post('/operator/confirm-complete-order', { object: object })
    .then(() => history.push('/operator/order-queries'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


// get stats for operator
export const getOperatorStats = (month, year) => (dispatch) => {
  dispatch(setLoadingStats());
  axios.post('/stats/for-operator', { month: month, year: year })
    .then(res =>
      dispatch({
        type: GOT_STATS_FOR_OPERATOR,
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


export const getRepeatOrders = (object) => (dispatch) => {
  dispatch(setLoadingSortedOrders());

  // set repeat order search Vars
  dispatch({
    type: SET_REPEAT_ORDER_SEARCH_VARS,
    payload: {
      method: object.type,
      headingDay: object.day || '',
      selectedDays: object.days || []
    }
  });

  axios.post('/operator/get-repeat-orders', { object })
    .then(res =>
      dispatch({
        type: GET_REPEAT_ORDERS,
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


export const repeatOrderNotNeeded = (id, history, occupation) => (dispatch) => {
  axios.post('/operator/repeat-order-not-needed', { id: id })
    .then(() => history.push(`/${occupation}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


// operator sees his own statistics
export const getStatsForOperator = (object) => (dispatch) => {
  dispatch(setLoadingStats());
  axios.post('/operator/get-operator-stats', { object: object })
    .then(res =>
      dispatch({
        type: GOT_STATS_FOR_OPERATOR,
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


export const getNotCompOrders = () => (dispatch) => {
  dispatch(setLoadingSortedOrders());
  axios.post('/operator/get-not-comp-orders')
    .then(res =>
      dispatch({
        type: GET_NOT_COMPLETED_ORDERS,
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


// Loading sorted orders
export const setLoadingSortedOrders = () => {
  return {
    type: SET_LOADING_SORTED_ORDERS
  };
};


// Loading complete orders
export const setLoadingCompleteOrders = () => {
  return {
    type: SET_LOADING_COMPLETE_ORDERS
  };
};


// loading stats
export const setLoadingStats = () => {
  return {
    type: SET_LOADING_OPERATOR_STATS
  };
}