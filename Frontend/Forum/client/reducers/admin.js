import { ADMIN_GET_REPORTED_MESSAGES } from '../actions/ActionTypes';

const INITIAL_STATE = {
  reportedMessages: [],
};

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADMIN_GET_REPORTED_MESSAGES:
    {
      const { data } = action;
      return {
        ...state,
        reportedMessages: data ? data.d : [],
      };
    }
    default:
      return state;
  }
};

export default app;
