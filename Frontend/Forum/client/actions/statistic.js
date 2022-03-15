import { LOAD_STATISTIC } from './ActionTypes';

import { loadingMainColumn, delayLoadedMainColum } from './loading';
import { getThreadStatistic, getUserStatistic } from '../../data';

export default function loadStatistic() {
  return (dispatch, getState) => {
    dispatch(loadingMainColumn());
    const type = LOAD_STATISTIC;
    const tasks = [getUserStatistic(0),
      getUserStatistic(6),
      getThreadStatistic(0),
      getThreadStatistic(7)];
    Promise.all(tasks).then((values) => {
      delayLoadedMainColum(dispatch);
      dispatch({
        type,
        mostUsersToday: values[0].data.d,
        mostUsersWeek: values[1].data.d,
        mostThreadsToday: values[2].data.d.Threads,
        mostThreadsWeek: values[3].data.d.Threads,
      });
    }).catch((err) => {
      delayLoadedMainColum(dispatch);
      console.log('Catch: ', err);
    });
  };
}
