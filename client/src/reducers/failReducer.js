import {
  SET_FAILED_ORDER,
  SET_FAIL_SEARCH_VARS,
  GET_FAILED_ORDERS,
  SET_LOADING_FAILED_ORDER
} from '../actions/types';

const initialState = {
  failedOrder: {
    disinfectorId: {},
    clientId: {
      contracts: []
    },
    userCreated: {},
    userAcceptedOrder: {},
    disinfectors: [],
    prevFailedOrder: {},
    nextOrderAfterFail: {}
  },

  fails: [],
  searchVars: {
    method: '',
    month: 0,
    year: 0,
    days: [],
    day: ''
  },
  loading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOADING_FAILED_ORDER:
      return {
        ...state,
        loading: true
      };

    case SET_FAILED_ORDER:
      return {
        ...state,
        failedOrder: action.payload,
        loading: false
      };

    case SET_FAIL_SEARCH_VARS:
      let object = { ...action.payload };
      return {
        ...state,
        searchVars: {
          ...state.searchVars,
          method: object.type,
          day: object.type === 'day' ? object.day : '',
          days: object.type === 'week' ? object.days : [],
          month: object.type === 'month' ? object.month : 0,
          year: object.type === 'month' ? object.year : 0
        }
      };

    case GET_FAILED_ORDERS:
      return {
        ...state,
        fails: action.payload,
        loading: false
      };

    default:
      return state;
  }
};