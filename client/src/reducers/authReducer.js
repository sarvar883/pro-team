import isEmpty from '../validation/is-empty';
import {
  SET_CURRENT_USER,
  GET_DISINFECTOR_MATERIALS,
  SUBADMIN_MATERIALS,
  LOADING_CURRENT_DISINFECTOR
} from '../actions/types';

const initialState = {
  isAuthenticated: false,
  loadingUser: false,
  user: {
    materials: []
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };

    case LOADING_CURRENT_DISINFECTOR:
      return {
        ...state,
        loadingUser: true
      };

    case GET_DISINFECTOR_MATERIALS:
      return {
        ...state,
        user: {
          ...state.user,
          materials: action.payload
        },
        loadingUser: false
      };

    case SUBADMIN_MATERIALS:
      return {
        ...state,
        user: {
          ...state.user,
          materials: action.payload.materials
        }
      };

    default:
      return state;
  }
};