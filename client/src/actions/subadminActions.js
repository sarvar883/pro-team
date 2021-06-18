import axios from 'axios';
import {
  GET_ERRORS,
  SUBADM_GET_MY_ORDERS,
  GET_SORTED_ORDERS_SUBADMIN,
  ALL_DISINFECTORS,
  SUBADMIN_MATERIALS,
  SUBADMIN_ADDS_MATERIAL,
  SUBADMIN_MAT_COM_HISTORY,
  SUBADMIN_MAT_DISTRIB_HISTORY,
  LOADING_SORTED_ORDERS_SUBADMIN,
  SUBADMIN_LOADING,
  SUBADMIN_LOADING_STATS
} from './types';


// get orders that subadmin should complete
export const getSubadmOrders = (id) => (dispatch) => {
  dispatch(setSubadminLoading());


  // 21.04.2021 now subadmin and disinfector refer to the same endpoint 
  // to get orders they should complete
  axios.post('/order/get-my-orders', { userId: id })
    // axios.post('/subadmin/get-my-orders', { id: id })
    .then(res =>
      dispatch({
        type: SUBADM_GET_MY_ORDERS,
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


export const getSortedOrders = (date) => (dispatch) => {
  dispatch(setLoadingSortedOrders());
  axios.post('/subadmin/get-sorted-orders', { date: date })
    .then(res =>
      dispatch({
        type: GET_SORTED_ORDERS_SUBADMIN,
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


export const getAllDisinfectors = () => (dispatch) => {
  dispatch(setSubadminLoading());

  const object = {
    method: 'role',
    roles: ['disinfector']
  };

  // axios.post('/subadmin/get-all-disinfectors')
  axios.post('/get-users', { object })
    .then(res =>
      dispatch({
        type: ALL_DISINFECTORS,
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


export const getSubadminMaterials = (id) => (dispatch) => {
  axios.post('/subadmin/get-subadmin-materials', { id: id })
    .then(res =>
      dispatch({
        type: SUBADMIN_MATERIALS,
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


// subadmin adds material to disinfector
export const addMaterialToDisinfector = (object, history) => (dispatch) => {
  axios.post('/subadmin/add-material-to-disinfector', { object: object })
    .then(res => {
      dispatch({
        type: SUBADMIN_ADDS_MATERIAL,
        payload: res.data
      });
      return history.push('/subadmin');
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


// subadmin sees how much material he received from admin
export const getMatComHistory = (object) => (dispatch) => {
  dispatch(loadingStats());
  axios.post('/subadmin/get-material-coming-history', { object: object })
    .then(res =>
      dispatch({
        type: SUBADMIN_MAT_COM_HISTORY,
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


// subadmin sees materials he distributed to disinfectors
export const getSubMatDistrib = (object) => (dispatch) => {
  dispatch(loadingStats());
  axios.post('/subadmin/get-material-distrib-history', { object: object })
    .then(res =>
      dispatch({
        type: SUBADMIN_MAT_DISTRIB_HISTORY,
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
    type: LOADING_SORTED_ORDERS_SUBADMIN
  };
};


// 
export const setSubadminLoading = () => {
  return {
    type: SUBADMIN_LOADING
  };
}


export const loadingStats = () => {
  return {
    type: SUBADMIN_LOADING_STATS
  };
}