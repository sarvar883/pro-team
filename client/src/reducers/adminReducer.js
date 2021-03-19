import {
  SET_LOADING_ORDER_QUERIES_FOR_ADMIN,
  SET_LOADING_ADMIN_STATS,
  SET_LOADING_DISINFECTORS,
  SET_LOADING_OPERATORS,
  SET_LOADING_ADD_MATERIAL_EVENTS,
  LOADING_SORTED_ORDERS_ADMIN,
  LOADING_CUR_MAT,
  LOADING_CLIENTS,
  SET_LOADING,

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
  GET_ALL_USERS,
  GET_USER_BY_ID,

  CLEAR_STATS_DATA_ADMIN,
  DELETE_QUERY_FROM_STATE,
  REMOVE_DISABLED_USER_FROM_DOM
} from '../actions/types';

const initialState = {
  orderQueries: [],
  disinfectors: [],
  operators: [],
  sortedOrders: [],
  clients: [],
  clientById: {
    orders: [],
    contracts: []
  },
  searchClientsMethod: '',
  searchClientsInput: '',
  ordersOfClient: [],

  users: [],
  userById: {},
  currentMaterials: {
    materials: []
  },
  stats: {
    disinfectorId: '',
    orders: [],
    acceptedOrders: []
  },
  method: '',
  addMatEvents: [],
  materialComing: [],
  addMatEventsMethod: '',
  loadingSortedOrders: false,
  loadingOrderQueries: false,
  loadingStats: false,
  loadingDisinfectors: false,
  loadingOperators: false,
  loadingAddMatEvents: false,
  loadingCurMat: false,
  loadingClients: false,
  loadingUsers: false,
  loadingOrdersOfClient: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_SORTED_ORDERS_ADMIN:
      return {
        ...state,
        loadingSortedOrders: true
      };

    case SET_LOADING_ORDER_QUERIES_FOR_ADMIN:
      return {
        ...state,
        loadingOrderQueries: true
      };

    case SET_LOADING_ADMIN_STATS:
      return {
        ...state,
        loadingStats: true
      };

    case SET_LOADING_DISINFECTORS:
      return {
        ...state,
        loadingDisinfectors: true
      };

    case SET_LOADING_OPERATORS:
      return {
        ...state,
        loadingOperators: true
      };

    case SET_LOADING_ADD_MATERIAL_EVENTS:
      return {
        ...state,
        loadingAddMatEvents: true
      };

    case LOADING_CUR_MAT:
      return {
        ...state,
        loadingCurMat: true
      };

    case LOADING_CLIENTS:
      return {
        ...state,
        loadingClients: true,
        searchClientsMethod: action.payload.method !== '' ? action.payload.method : state.searchClientsMethod,
        searchClientsInput: action.payload.payload !== '' ? action.payload.payload : state.searchClientsInput
      };

    case GET_SORTED_ORDERS_ADMIN:
      return {
        ...state,
        sortedOrders: action.payload,
        date: action.date,
        loadingSortedOrders: false
      };

    case GET_ORDER_QUERIES_FOR_ADMIN:
      return {
        ...state,
        orderQueries: action.payload,
        loadingOrderQueries: false
      };

    case GET_ADMIN_MONTH_STATS:
      return {
        ...state,
        method: 'month',
        stats: {
          ...state.stats,
          orders: action.payload
        },
        loadingStats: false
      };

    case GET_ADMIN_WEEK_STATS:
      return {
        ...state,
        method: 'week',
        stats: {
          ...state.stats,
          orders: action.payload
        },
        loadingStats: false
      };

    case GET_ADMIN_DAY_STATS:
      return {
        ...state,
        method: 'day',
        stats: {
          ...state.stats,
          orders: action.payload
        },
        loadingStats: false
      };

    case DISINF_STATS_MONTH_ADMIN:
      return {
        ...state,
        method: 'month',
        stats: {
          ...state.stats,
          disinfectorId: action.payload.disinfectorId,
          orders: action.payload.orders,
          acceptedOrders: action.payload.acceptedOrders
        },
        loadingStats: false
      };

    case DISINF_STATS_MONTH_WEEK:
      return {
        ...state,
        method: 'week',
        stats: {
          ...state.stats,
          disinfectorId: action.payload.disinfectorId,
          orders: action.payload.orders,
          acceptedOrders: action.payload.acceptedOrders
        },
        loadingStats: false
      };

    case DISINF_STATS_DAY_ADMIN:
      return {
        ...state,
        method: 'day',
        stats: {
          ...state.stats,
          disinfectorId: action.payload.disinfectorId,
          orders: action.payload.orders,
          acceptedOrders: action.payload.acceptedOrders
        },
        loadingStats: false
      };

    case GET_ADV_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          orders: action.payload
        },
        loadingStats: false
      };

    case GET_OPERATOR_STATS:
      return {
        ...state,
        method: action.payload.method,
        stats: {
          ...state.stats,
          orders: action.payload.sortedOrders
        },
        loadingStats: false
      };

    case GET_ALL_DISINFECTORS_FOR_ADMIN:
      return {
        ...state,
        disinfectors: action.payload,
        loadingDisinfectors: false
      };

    case GET_ALL_OPERATORS_FOR_ADMIN:
      return {
        ...state,
        operators: action.payload,
        loadingOperators: false
      };

    case GET_ALL_OPERATORS_AND_ADMINS_FOR_ADMIN:
      return {
        ...state,
        operators: action.payload,
        loadingOperators: false
      };

    case GET_ADD_MAT_EVENTS_MONTH:
      return {
        ...state,
        addMatEvents: action.payload,
        addMatEventsMethod: 'month',
        loadingAddMatEvents: false
      };

    case GET_ADD_MAT_EVENTS_WEEK:
      return {
        ...state,
        addMatEvents: action.payload,
        addMatEventsMethod: 'week',
        loadingAddMatEvents: false
      };

    case ADD_MAT_DISINFECTOR:
      let disinfectorIndex = state.disinfectors.findIndex(item => item._id.toString() === action.payload.disinfector);
      let array = [...state.disinfectors];
      action.payload.materials.forEach(item => {
        array[disinfectorIndex].materials.forEach(thing => {
          if (thing.material === item.material) {
            thing.amount += Number(item.amount);
            return;
          }
        });
      });
      return {
        ...state,
        disinfectors: array
      };

    case GET_CURR_MAT_ADMIN:
      return {
        ...state,
        loadingCurMat: false,
        currentMaterials: action.payload
      };

    case UPDATE_MAT_COMING:
      return {
        ...state,
        currentMaterials: action.payload
      };

    case MAT_COMING_MONTH:
      return {
        ...state,
        materialComing: action.payload,
        addMatEventsMethod: 'month',
        loadingStats: false
      };

    case MAT_COMING_WEEK:
      return {
        ...state,
        materialComing: action.payload,
        addMatEventsMethod: 'week',
        loadingStats: false
      };

    case SEARCH_CLIENTS:
      return {
        ...state,
        clients: action.payload,
        loadingClients: false
      };

    case CLIENT_BY_ID:
      return {
        ...state,
        clientById: action.payload,
        loadingClients: false
      };

    case SET_ORDERS_OF_CLIENT:
      return {
        ...state,
        ordersOfClient: action.payload,
        loadingOrdersOfClient: false
      };

    case SET_LOADING_CLIENT_ORDERS:
      return {
        ...state,
        loadingOrdersOfClient: true
      };

    case GET_ALL_USERS:
      return {
        ...state,
        users: action.payload,
        loadingUsers: false
      };

    case GET_USER_BY_ID:
      return {
        ...state,
        userById: action.payload
      };


    case CLEAR_STATS_DATA_ADMIN:
      return {
        ...state,
        stats: {
          ...state.stats,
          disinfectorId: '',
          orders: [],
          acceptedOrders: []
        }
      };

    case DELETE_QUERY_FROM_STATE:
      return {
        ...state,
        orderQueries: state.orderQueries.filter(item => item._id !== action.payload)
      };

    case REMOVE_DISABLED_USER_FROM_DOM:
      return {
        ...state,
        users: state.users.filter(item => item._id !== action.payload)
      };

    case SET_LOADING:
      // this is used when admin loads all users and user by id
      return {
        ...state,
        loadingUsers: true
      };

    default:
      return state;
  }
};