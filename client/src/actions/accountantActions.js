import axios from 'axios';
import {
  GET_ERRORS,
  GET_ACC_QUERIES,
  GET_ACC_QUERY_BY_ID,
  GET_ACC_STATS,
  DELETE_QUERY_FROM_STATE,
  SET_TIME_PERIOD,
  LOADING_ACC_QUERIES,
  ACC_CLEAR_STATS,
  SET_LOADING_ACC_STATS
} from './types';


// get order queries for accountant to confirm (only corporate clients)
export const getAccountantQueries = (object) => (dispatch) => {
  dispatch(setTimePeriod(object));
  dispatch(loadingQueries());

  axios.post('/accountant/get-queries', { object })
    .then(res => {
      return dispatch({
        type: GET_ACC_QUERIES,
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


// accountant gets complete order by id to fill the confirmation form
export const getCompleteOrderById = (id) => (dispatch) => {
  dispatch(loadingQueries());
  axios.post('/accountant/get-query-by-id', { id: id })
    .then(res =>
      dispatch({
        type: GET_ACC_QUERY_BY_ID,
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


// accountant confirms or rejects completed order
export const accountantConfirmQuery = (object, history) => (dispatch) => {
  // delete query from global state because the query should not stay in queries page
  dispatch(deleteQuery(object.orderId));

  axios.post('/accountant/confirm-query', { object: object })
    .then(() => history.push('/accountant/queries'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


// accountant sees statistics
export const getAccStats = (object) => (dispatch) => {
  dispatch(setLoadingStats());
  axios.post('/accountant/get-stats', { object: object })
    .then(res =>
      dispatch({
        type: GET_ACC_STATS,
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


// delete query from global state
export const deleteQuery = (id) => {
  return {
    type: DELETE_QUERY_FROM_STATE,
    payload: id
  }
}


// set time to preserve time data in global state
export const setTimePeriod = (object) => {
  return {
    type: SET_TIME_PERIOD,
    payload: object
  }
}


export const clearStats = () => {
  return {
    type: ACC_CLEAR_STATS
  }
};


// Loadings
export const loadingQueries = () => {
  return {
    type: LOADING_ACC_QUERIES
  };
}


// loading stats
export const setLoadingStats = () => {
  return {
    type: SET_LOADING_ACC_STATS
  };
}