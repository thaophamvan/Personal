import { LOAD_FOOTER_TOP_DAY, LOAD_FOOTER_TOP_WEEK } from '../actions/ActionTypes';

const INITIAL_STATE = {
  threadsToday: {
    Threads: [],
  },
  threadsInWeek: {
    Threads: [],
  },
};

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_FOOTER_TOP_DAY:
    {
      const { Threads } = action;
      return {
        ...state,
        threadsToday: {
          Threads,
        },
      };
    }
    case LOAD_FOOTER_TOP_WEEK: {
      const { Threads } = action;

      return {
        ...state,
        threadsInWeek: {
          Threads,
        },
      };
    }
    default:
      return state;
  }
};

export default app;
