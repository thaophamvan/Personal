import React from 'react'
import { getUserInfo, createSession } from '../../actions/user'

const LoginPage = (props) => {
  const loadSekeleton = (s) => {
    s.dispatch(getUserInfo())
  }

  const isAuthenticated = () => {
    const currentURL = new URL(window.location.href)
    return currentURL.searchParams.get('code')
  }

  const createCredential = (s) => {
    s.dispatch(createSession(isAuthenticated()))
  }
  if (isAuthenticated()) {
    createCredential()
  } else {
    loadSekeleton()
  }

  return (
    <span />
  )
}

export default LoginPage
