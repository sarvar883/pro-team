import {
  GET_ACC_QUERIES,
  GET_ACC_QUERY_BY_ID,
  GET_ACC_STATS,
  DELETE_QUERY_FROM_STATE,
  SET_TIME_PERIOD,
  SEARCH_CONTRACTS,
  LOADING_ACC_QUERIES,
  ACC_CLEAR_STATS,
  SET_LOADING_ACC_STATS
} from '../actions/types';


const initialState = {
  orders: [],
  queries: [],
  queryVars: {
    method: '',
    orders: [],
    month: 0,
    year: 0,
    days: [],
    day: ''
  },

  queryById: {
    disinfectorId: {},
    userCreated: {},
    clientId: {
      contracts: []
    },
    userAcceptedOrder: {},
    disinfectors: [],
    prevFailedOrder: {},
    nextOrderAfterFail: {}
  },
  stats: {
    method: '',
    orders: [],
    month: 0,
    year: 0,
    days: [],
    day: ''
  },
  loadingQueries: false,
  loadingStats: false
};


export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ACC_QUERIES:
      return {
        ...state,
        queries: action.payload,
        loadingQueries: false
      };

    case GET_ACC_QUERY_BY_ID:
      return {
        ...state,
        queryById: action.payload,
        loadingQueries: false
      };

    case GET_ACC_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          orders: action.payload.orders,
          method: action.payload.method
        },
        loadingStats: false
      };

    case DELETE_QUERY_FROM_STATE:
      return {
        ...state,
        queries: state.queries.filter(item => item._id !== action.payload)
      };

    case SET_TIME_PERIOD:
      let object = { ...action.payload };
      return {
        ...state,
        queryVars: {
          ...state.queryVars,
          method: object.type,
          day: object.type === 'day' ? object.day : '',
          days: object.type === 'week' ? object.days : [],
          month: object.type === 'month' ? object.month : 0,
          year: object.type === 'month' ? object.year : 0
        }
      };

    case SEARCH_CONTRACTS:
      return {
        ...state,
        orders: action.payload,
        loadingQueries: false
      };

    case ACC_CLEAR_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          orders: [],
          method: '',
          month: 0,
          year: 0,
          days: [],
          day: ''
        }
      };

    // loadings
    case LOADING_ACC_QUERIES:
      return {
        ...state,
        loadingQueries: true
      };

    case SET_LOADING_ACC_STATS:
      return {
        ...state,
        loadingStats: true
      };

    default:
      return state;
  }
}