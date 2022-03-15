import { LOAD_STATISTIC } from '../actions/ActionTypes';

const INITIAL_STATE = {
  mostUsersToday: [],
  mostUsersWeek: [],
  mostThreadsToday: [],
  mostThreadsWeek: [],
};

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_STATISTIC:
    {
      const { mostUsersToday, mostUsersWeek, mostThreadsToday, mostThreadsWeek } = action;
      return {
        ...state,
        mostUsersToday,
        mostUsersWeek,
        mostThreadsToday,
        mostThreadsWeek,
      };
    }
    default:
      return state;
  }
};
export default app;
