import 'bootstrap/dist/js/bootstrap.bundle.min'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './app'
import store from './stores'
import { getUserInfo, createSession } from './actions/user'
import './styles/site.scss'
import './i18n'

const loadSekeleton = (s) => {
  s.dispatch(getUserInfo())
}

const getParamCode = () => {
  const currentURL = new URL(window.location.href)
  return currentURL.searchParams.get('code')
}

const createCredential = (s) => {
  s.dispatch(createSession(getParamCode()))
}

if (getParamCode()) {
  createCredential(store)
} else {
  loadSekeleton(store)
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)
