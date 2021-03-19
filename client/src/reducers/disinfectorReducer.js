import {
  GET_ALL_DISINFECTORS,
  GET_DISINF_MONTH_STATS,
  GET_DISINF_WEEK_STATS,
  GET_DISINF_DAY_STATS,
  GET_ADD_MATERIAL_EVENTS,
  DISINF_MAT_COMINGS,
  DISINF_MAT_DISTRIBS,
  GET_RETURNED_QUERIES,
  LOADING_DISINF_STATS,
  SET_LOADING_DISINFECTORS,
  LOADING_ADD_MATERIAL_EVENTS,
  CLEAR_STATS_DATA_ADMIN
} from '../actions/types';

const initialState = {
  disinfectors: [],
  stats: {
    orders: [],
    acceptedOrders: [],
    addedMaterials: []
  },
  method: '',
  queries: [],
  matComing: [],
  matDistrib: [],
  addMaterialEvents: [],
  loadingDisinfectors: false,
  loadingDisinfStats: false,
  loadingEvents: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DISINF_STATS:
      return {
        ...state,
        loadingDisinfStats: true
      };

    case SET_LOADING_DISINFECTORS:
      return {
        ...state,
        loadingDisinfectors: true
      };

    case LOADING_ADD_MATERIAL_EVENTS:
      return {
        ...state,
        loadingEvents: true
      };

    case GET_ALL_DISINFECTORS:
      return {
        ...state,
        disinfectors: action.payload,
        loadingDisinfectors: false
      };

    case GET_DISINF_MONTH_STATS:
      return {
        ...state,
        method: 'month',
        stats: {
          ...state.stats,
          orders: action.payload.orders,
          acceptedOrders: action.payload.acceptedOrders,
          addedMaterials: action.payload.addedMaterials
        },
        loadingDisinfStats: false
      };

    case GET_DISINF_WEEK_STATS:
      return {
        ...state,
        method: 'week',
        stats: {
          ...state.stats,
          orders: action.payload.orders,
          acceptedOrders: action.payload.acceptedOrders,
          addedMaterials: action.payload.addedMaterials
        },
        loadingDisinfStats: false
      };

    case GET_DISINF_DAY_STATS:
      return {
        ...state,
        method: 'day',
        stats: {
          ...state.stats,
          orders: action.payload.orders,
          acceptedOrders: action.payload.acceptedOrders,
          addedMaterials: action.payload.addedMaterials
        },
        loadingDisinfStats: false
      };

    case GET_ADD_MATERIAL_EVENTS:
      return {
        ...state,
        addMaterialEvents: action.payload,
        loadingEvents: false
      };

    case DISINF_MAT_COMINGS:
      return {
        ...state,
        matComing: action.payload,
        loadingDisinfStats: false
      };

    case DISINF_MAT_DISTRIBS:
      return {
        ...state,
        matDistrib: action.payload,
        loadingDisinfStats: false
      };

    case GET_RETURNED_QUERIES:
      return {
        ...state,
        queries: action.payload
      };

    case CLEAR_STATS_DATA_ADMIN:
      return {
        ...state,
        method: '',
        stats: {
          ...state.stats,
          disinfectorId: '',
          orders: [],
          acceptedOrders: []
        }
      };

    default:
      return state;
  };
}