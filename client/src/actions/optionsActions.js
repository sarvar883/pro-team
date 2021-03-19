import {
  SET_THEME
} from './types';


export const setTheme = (theme) => (dispatch) => {
  // edit localStorage
  localStorage.setItem('proTeamTheme', theme);

  // edit in redux
  dispatch({
    type: SET_THEME,
    payload: theme
  });
};