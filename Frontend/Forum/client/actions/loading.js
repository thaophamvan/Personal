import { delay, compose } from './utilities';

import { LOADING_LEFT_COLUMN, LOADING_MAIN_COLUMN, LOADED_LEFT_COLUMN, LOADING_TYPE2_MAIN_COLUMN,
  LOADED_MAIN_COLUMN, LOADED_TYPE2_MAIN_COLUMN } from './ActionTypes';

export function loadingLeftColumn() {
  return {
    type: LOADING_LEFT_COLUMN,
  };
}

export function loadedLeftColumn() {
  return {
    type: LOADED_LEFT_COLUMN,
  };
}

export function loadingMainColumn(loadingType) {
  const type = loadingType === 'TYPE2' ? LOADING_TYPE2_MAIN_COLUMN : LOADING_MAIN_COLUMN;
  return {
    type,
  };
}

export function loadedMainColumn(loadingType) {
  const type = loadingType === 'TYPE2' ? LOADED_TYPE2_MAIN_COLUMN : LOADED_MAIN_COLUMN;
  return {
    type,
  };
}

export function delayLoadedMainColum(dispatch, loadingType) {
  delay(compose(dispatch, () => loadedMainColumn(loadingType)), 100);
}
