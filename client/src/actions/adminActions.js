import axios from 'axios';
import {
  GET_ERRORS,

  SET_LOADING_ORDER_QUERIES_FOR_ADMIN,
  SET_LOADING_ADMIN_STATS,
  SET_LOADING_DISINFECTORS,
  SET_LOADING_OPERATORS,
  SET_LOADING_ADD_MATERIAL_EVENTS,
  LOADING_SORTED_ORDERS_ADMIN,
  LOADING_CUR_MAT,
  LOADING_CLIENTS,

  GET_SORTED_ORDERS_ADMIN,
  GET_ORDER_QUERIES_FOR_ADMIN,
  GET_ADMIN_MONTH_STATS,
  GET_ADMIN_WEEK_STATS,
  GET_ADMIN_DAY_STATS,
  GET_ADV_STATS,
  GET_OPERATOR_STATS,
  GET_ALL_DISINFECTORS_FOR_ADMIN,
  GET_ALL_OPERATORS_FOR_ADMIN,
  GET_ALL_OPERATORS_AND_ADMINS_FOR_ADMIN,
  GET_ADD_MAT_EVENTS_MONTH,
  GET_ADD_MAT_EVENTS_WEEK,
  DISINF_STATS_MONTH_ADMIN,
  DISINF_STATS_MONTH_WEEK,
  DISINF_STATS_DAY_ADMIN,
  ADD_MAT_DISINFECTOR,
  GET_CURR_MAT_ADMIN,
  UPDATE_MAT_COMING,
  MAT_COMING_MONTH,
  MAT_COMING_WEEK,
  SEARCH_CLIENTS,
  CLIENT_BY_ID,
  SET_ORDERS_OF_CLIENT,
  SET_LOADING_CLIENT_ORDERS,
  GET_USER_BY_ID,

  CLEAR_STATS_DATA_ADMIN,
  DELETE_QUERY_FROM_STATE,
  REMOVE_DISABLED_USER_FROM_DOM
} from './types';


export const getSortedOrders = (date) => (dispatch) => {
  dispatch(setLoadingSortedOrders());
  axios.post('/admin/get-sorted-orders', { date: date })
    .then(res =>
      dispatch({
        type: GET_SORTED_ORDERS_ADMIN,
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


export const getQueriesForAdmin = () => (dispatch) => {
  dispatch(setLoadingQueriesForAdmin());
  axios.post('/admin/get-order-queries-for-admin')
    .then(res =>
      dispatch({
        type: GET_ORDER_QUERIES_FOR_ADMIN,
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


export const adminConfirmsOrderQuery = (object, history) => (dispatch) => {
  // delete query from global state because the query should not stay in queries page
  dispatch(deleteQuery(object.orderId));

  axios.post('/admin/admin-confirms-order-query', { object: object })
    .then(() => history.push('/admin/order-queries'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getGenStatsForAdmin = (object) => (dispatch) => {
  dispatch(loadingStats());

  axios.post('/stats/for-admin-general', { object })
    .then(res => {

      if (object.type === 'month') {
        return dispatch({
          type: GET_ADMIN_MONTH_STATS,
          payload: res.data
        });

      } else if (object.type === 'week') {
        return dispatch({
          type: GET_ADMIN_WEEK_STATS,
          payload: res.data
        });

      } else if (object.type === 'day') {
        return dispatch({
          type: GET_ADMIN_DAY_STATS,
          payload: res.data
        });
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getAdvStats = (object) => (dispatch) => {
  dispatch(loadingStats());
  axios.post('/stats/adv-stats', { object: object })
    .then(res =>
      dispatch({
        type: GET_ADV_STATS,
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


// get operator stats
export const getOperatorStats = (object) => (dispatch) => {
  dispatch(loadingStats());
  axios.post('/stats/operator-stats', { object: object })
    .then(res =>
      dispatch({
        type: GET_OPERATOR_STATS,
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


export const getAllDisinfectorsAndSubadmins = () => (dispatch) => {
  dispatch(loadingDisinfectors());

  const object = {
    method: 'role',
    roles: ['disinfector', 'subadmin']
  };

  // axios.post('/admin/get-all-disinfectors-and-subadmins')
  axios.post('/get-users', { object })
    .then(res =>
      dispatch({
        type: GET_ALL_DISINFECTORS_FOR_ADMIN,
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


export const getAllOperators = () => (dispatch) => {
  dispatch(loadingOperators());

  const object = {
    method: 'role',
    roles: ['operator']
  };

  // axios.post('/admin/get-all-operators')
  axios.post('/get-users', { object })
    .then(res =>
      dispatch({
        type: GET_ALL_OPERATORS_FOR_ADMIN,
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


export const getAllOperatorsAndAmins = () => (dispatch) => {
  dispatch(loadingOperators());

  const object = {
    method: 'role',
    roles: ['operator', 'admin']
  };

  // axios.post('/admin/get-all-operators-and-admins')
  axios.post('/get-users', { object })
    .then(res =>
      dispatch({
        type: GET_ALL_OPERATORS_AND_ADMINS_FOR_ADMIN,
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


export const addMaterialToDisinfector = (object, occupation, history) => (dispatch) => {
  axios.post('/admin/add-materials-to-disinfector', { object: object })
    .then(res => {
      dispatch({
        type: ADD_MAT_DISINFECTOR,
        payload: res.data
      });
      return history.push(`/${occupation}`);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getAddMaterialEvents = (object) => (dispatch) => {
  dispatch(loadingAddMatEvents());

  axios.post('/admin/get-add-material-events', { object })
    .then(res => {
      if (object.type === 'month') {
        return dispatch({
          type: GET_ADD_MAT_EVENTS_MONTH,
          payload: res.data
        });

      } else if (object.type === 'week') {
        return dispatch({
          type: GET_ADD_MAT_EVENTS_WEEK,
          payload: res.data
        });

      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getDisinfectorStatsForAdmin = (object) => (dispatch) => {
  dispatch(loadingStats());

  axios.post('/stats/for-admin-disinfector-stats', { object })
    .then(res => {

      if (object.type === 'month') {
        return dispatch({
          type: DISINF_STATS_MONTH_ADMIN,
          payload: res.data
        });

      } else if (object.type === 'week') {
        return dispatch({
          type: DISINF_STATS_MONTH_WEEK,
          payload: res.data
        });

      } else if (object.type === 'day') {
        return dispatch({
          type: DISINF_STATS_DAY_ADMIN,
          payload: res.data
        });
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getCurrentMaterials = () => (dispatch) => {
  dispatch(loadingCurMat());
  axios.post('/admin/get-current-materials')
    .then(res =>
      dispatch({
        type: GET_CURR_MAT_ADMIN,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    )
};


// add material coming
export const addMatComing = (object, history) => (dispatch) => {
  axios.post('/admin/add-mat-coming', { object: object })
    .then(res => {
      dispatch({
        type: UPDATE_MAT_COMING,
        payload: res.data
      });
      history.push('/admin');
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    )
};


export const getMaterialComingEvents = (object) => (dispatch) => {
  dispatch(loadingStats());

  axios.post('/admin/get-mat-coming', { object })
    .then(res => {
      if (object.type === 'month') {
        return dispatch({
          type: MAT_COMING_MONTH,
          payload: res.data
        });

      } else if (object.type === 'week') {
        return dispatch({
          type: MAT_COMING_WEEK,
          payload: res.data
        });

      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    )
};


export const addClient = (object, history, occupation) => (dispatch) => {
  axios.post('/admin/add-client', { object: object })
    .then(res => history.push(`/${occupation}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
};


export const editClient = (object, history) => (dispatch) => {
  axios.post('/admin/edit-client', { object })
    .then(res => history.push(`/client/${object.id}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
};


export const changeContractNumbers = (object, history) => (dispatch) => {
  axios.post('/admin/change-contract-numbers', { object })
    .then(res =>
      dispatch({
        type: CLIENT_BY_ID,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    )
};


export const searchClients = (object) => (dispatch) => {
  dispatch(loadingClients(object));
  axios.post('/admin/search-clients', { object: object })
    .then(res =>
      dispatch({
        type: SEARCH_CLIENTS,
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


export const clientById = (id) => (dispatch) => {
  dispatch(loadingClients({}));
  axios.post('/admin/client-by-id', { id: id })
    .then(res =>
      dispatch({
        type: CLIENT_BY_ID,
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


export const getOrdersOfClient = (object) => (dispatch) => {
  dispatch({
    type: SET_LOADING_CLIENT_ORDERS
  });

  axios.post('/admin/get-orders-of-client', { object })
    .then(res =>
      dispatch({
        type: SET_ORDERS_OF_CLIENT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );;
};


export const changePassword = (object, history) => (dispatch) => {
  axios.post('/change-password', { object: object })
    .then(() => history.push('/admin/users'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const getUserById = (userId) => (dispatch) => {
  axios.post('/get-user-by-id', { userId: userId })
    .then(res =>
      dispatch({
        type: GET_USER_BY_ID,
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


export const setUserById = (user) => (dispatch) => {
  dispatch({ type: GET_USER_BY_ID, payload: user });
};


export const editUser = (object, history) => (dispatch) => {
  axios.post('/edit-user', { object: object })
    .then(() => history.push('/admin/users'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const disableUser = (object, history) => (dispatch) => {
  // remode diabled user from Global State
  dispatch({
    type: REMOVE_DISABLED_USER_FROM_DOM,
    payload: object.id
  });

  axios.post('/disable-user', { object: object })
    .then(() => history.push('/admin/users'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const addNewMaterial = (object, history) => (dispatch) => {
  axios.post('/admin/new-material', { object })
    .then(() => history.push('/admin'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const deleteMaterialFromDB = (object, history) => (dispatch) => {
  axios.post('/admin/delete-material', { object })
    .then(() => history.push('/admin'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const setDisinfectorMaterials = (object, history) => (dispatch) => {
  axios.post('/admin/set-disinfector-materials', { object })
    .then(() => history.push('/admin'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};


export const setCurrentMaterials = (object, history) => (dispatch) => {
  axios.post('/admin/set-current-materials', { object })
    .then(() => history.push('/admin/material-coming'))
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


export const clearStatsData = () => (dispatch) => {
  return dispatch({
    type: CLEAR_STATS_DATA_ADMIN,
    payload: {}
  });
};


// Loading sorted orders
export const setLoadingSortedOrders = () => {
  return {
    type: LOADING_SORTED_ORDERS_ADMIN
  };
};


// Loading order queries for admin
export const setLoadingQueriesForAdmin = () => {
  return {
    type: SET_LOADING_ORDER_QUERIES_FOR_ADMIN
  };
};


// Loading stats for admin
export const loadingStats = () => {
  return {
    type: SET_LOADING_ADMIN_STATS
  };
}


// Loading disinfectors for admin
export const loadingDisinfectors = () => {
  return {
    type: SET_LOADING_DISINFECTORS
  };
}


// Loading operators for admin
export const loadingOperators = () => {
  return {
    type: SET_LOADING_OPERATORS
  };
}


// Loading add material events for admin
export const loadingAddMatEvents = () => {
  return {
    type: SET_LOADING_ADD_MATERIAL_EVENTS
  };
}


// loading current materials
export const loadingCurMat = () => {
  return {
    type: LOADING_CUR_MAT
  };
}

export const loadingClients = (object) => {
  if (!object.method) {
    object.method = '';
  }
  if (!object.payload) {
    object.payload = '';
  }
  return {
    type: LOADING_CLIENTS,
    payload: object
  };
}