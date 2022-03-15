import * as actionTypes from '../actions/ActionTypes';

const sortOptions = [
  {
    text: 'Äldsta kommentaren överst',
    value: 'asc',
  },
  {
    text: 'Senaste kommentaren överst',
    value: 'desc',
  },
  {
    text: 'Senast nästlade överst',
    value: 'comment',
  },
];

const INITIAL_STATE = {
  Thread: {
    ForumId: 0,
    ForumName: null,
    ThreadId: 0,
    Subject: '',
    CreateDate: '',
    UserAlias: '',
    UserId: 0,
    MessageCount: 0,
    LikeCount: 0,
    Body: '',
    LastMessageId: 0,
    ThreadStatus: 0,
    LastMessageDate: '',
    State: 0,
    StateString: '',
    Number: 0,
  },
  Image: {
    FileUrl: '',
    Succeded: false,
    Message: '',
  },
  IsMarked: false,
  FirstMessageId: 0,
  LastReadMessageId: 0,
  Comments: [],
  UnreadMessageCount: 0,
  sortOptions,
  selectedSortOption: 'asc',
};


const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.LOAD_CURRENT_MAIN_TOPIC:
    {
      const {
        Thread,
        Comments,
        IsMarked,
        FirstMessageId,
        LastReadMessageId,
        UnreadMessageCount,
      } = action;
      return {
        ...state,
        Thread,
        Comments,
        IsMarked,
        FirstMessageId,
        LastReadMessageId,
        UnreadMessageCount,
      };
    }
    case actionTypes.CHANGE_SORT_COMMENTS:
    {
      const { Comments, selectedSortOption } = action;
      return {
        ...state,
        Comments,
        selectedSortOption,
      };
    }
    case actionTypes.UPLOAD_IMAGE_SUCCESS:
    {
      const { Image } = action;
      return {
        ...state,
        Image,
      };
    }
    case actionTypes.UPLOAD_IMAGE_FAIL:
    {
      const { Image } = action;
      return {
        ...state,
        Image,
      };
    }
    case actionTypes.LOAD_EMPTY_MAIN_TOPIC:
    {
      return {
        ...state,
        Thread: null,
      };
    }
    default:
      return state;
  }
};

export default app;
