import { createStore, applyMiddleware, compose } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'

export const history = createHistory()
const loggerMiddleware = createLogger()
const initialState = {}
const enhancers = []
const middleware = [thunk, routerMiddleware(history)]
const debug = process.env.NODE_ENV === 'local'
const middlewareProd = [
  ...middleware,
  debug && loggerMiddleware,
].filter(Boolean)
/*eslint-disable */
if (debug) {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middlewareProd),
  ...enhancers,
)

// @see https://github.com/facebook/create-react-app/issues/2317
const store = createStore(
  connectRouter(history)(rootReducer),
  initialState,
  composedEnhancers,
)

export default store
