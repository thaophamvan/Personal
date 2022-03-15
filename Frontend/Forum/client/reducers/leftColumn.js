import { find } from 'lodash/core';
import {
  LOAD_LEFT_COLUMN, GO_TO_PAGE_LEFT_COLUMN,
  CHANGE_LEFT_COLUMN_FILTER, LOAD_CREDENTIALS,
  LEFT_COLUMN_BY_USER, LEFT_COLUMN_ADD_REPORTED_FILTER,
  SET_SELECTED_THREAD,
} from '../actions/ActionTypes';

import * as utils from '../utilities';

const filterOptions = [
  {
    text: 'Oläst',
    value: 'unread',
    isSeparator: true,
    isDisabled: true,
  },
  {
    text: 'Trådar jag följer',
    value: 'following',
    isDisabled: true,
  },
  {
    text: 'Favoritskribenter',
    value: 'favorites',
    isDisabled: true,
  },
  {
    text: 'Skrivet av mig',
    value: 'mine',
    isDisabled: true,
    isSeparator: true,
  },
  {
    text: 'Dagens trådar',
    value: 'today',
  },
  {
    text: 'Gårdagens trådar',
    value: 'yesterday',
  },
];

const INITIAL_STATE = {
  selectedThread: null,
  pageSize: 30,
  currentPage: 1,
  totalPages: 0,
  TotalThreadCount: 0,
  MaxMessageId: null,
  Threads: [],
  selectedFilter: 'today',
  previousSelectedFilter: 'today',
  filterOptions,
  orderBy: 'LatestComment',
  selectedFilerByUser: '',
  selectedFilerUserAlias: '',
};

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_LEFT_COLUMN_FILTER: {
      const { selectedFilter } = action;
      const { data, selectedThread, totalPages, currentPage, previousSelectedFilter } = action;
      const { Threads, TotalThreadCount, MaxMessageId } = data;
      return {
        ...state,
        selectedFilter,
        Threads,
        TotalThreadCount,
        MaxMessageId,
        selectedThread,
        totalPages,
        currentPage,
        previousSelectedFilter,
      };
    }
    case LOAD_LEFT_COLUMN: {
      const { data, selectedThread, totalPages, currentPage } = action;
      const { Threads, TotalThreadCount, MaxMessageId } = data;

      return {
        ...state,
        Threads,
        TotalThreadCount,
        MaxMessageId,
        selectedThread,
        totalPages,
        currentPage,
      };
    }
    case GO_TO_PAGE_LEFT_COLUMN: {
      const { data, selectedThread, totalPages, currentPage, orderBy } = action;
      const { Threads, TotalThreadCount, MaxMessageId } = data;
      return {
        ...state,
        Threads,
        TotalThreadCount,
        MaxMessageId,
        selectedThread,
        totalPages,
        currentPage,
        orderBy,
      };
    }
    case LOAD_CREDENTIALS: {
      const { credentials } = action;
      const isAuthorization = utils.validateAuthorization(credentials);

      const newFilterOptions = filterOptions.map((option) => {
        const modification = option;
        if (modification.value === 'today' || modification.value === 'yesterday') {
          return option;
        }
        modification.isDisabled = !isAuthorization;
        return modification;
      });
      return {
        ...state,
        filterOptions: newFilterOptions,
      };
    }
    case LEFT_COLUMN_BY_USER: {
      const { selectedFilerByUser,
        selectedFilerUserAlias,
        previousSelectedFilter,
        currentPage,
      } = action;
      const newFilterOptions = state.filterOptions;

      const byUserOption = find(newFilterOptions, { value: 'byuser' });
      if (!byUserOption) {
        newFilterOptions.push({
          text: selectedFilerUserAlias,
          value: 'byuser',
        });
      } else {
        byUserOption.text = selectedFilerUserAlias;
      }
      const selectedFilter = 'byuser';
      return {
        ...state,
        currentPage,
        selectedFilerByUser,
        selectedFilerUserAlias,
        filterOptions: newFilterOptions,
        selectedFilter,
        previousSelectedFilter,
      };
    }
    case LEFT_COLUMN_ADD_REPORTED_FILTER: {
      const newFilterOptions = state.filterOptions;
      const abusedOption = find(newFilterOptions, { value: 'abused' });
      if (!abusedOption) {
        // add separator
        const lastOption = newFilterOptions[newFilterOptions.length - 1];
        if (lastOption) {
          lastOption.isSeparator = true;
        }
        newFilterOptions.push({
          text: 'Anmälda inlägg',
          value: 'abused',
        });
      }
      return {
        ...state,
        filterOptions: newFilterOptions,
      };
    }
    case SET_SELECTED_THREAD: {
      const { selectedThread } = action;
      return {
        ...state,
        selectedThread,
      };
    }
    default:
      return state;
  }
};

export default app;
