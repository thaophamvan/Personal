import { LOAD_FOOTER_TOP_DAY, LOAD_FOOTER_TOP_WEEK } from './ActionTypes';

import { getTop } from '../../data';

export function loadTopThreadsInDay() {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedForum } = state.app;
    const type = LOAD_FOOTER_TOP_DAY;
    getTop(selectedForum, 1, 5, 0).then((serverData) => {
      const { Threads } = serverData.data.d;
      dispatch({
        type,
        Threads,
      });
    });
  };
}

export function loadTopThreadsInWeek() {
  return (dispatch, getState) => {
    const state = getState();
    const { selectedForum } = state.app;
    const type = LOAD_FOOTER_TOP_WEEK;
    getTop(selectedForum, 1, 5, 6).then((serverData) => {
      const { Threads } = serverData.data.d;
      dispatch({
        type,
        Threads,
      });
    });
  };
}
