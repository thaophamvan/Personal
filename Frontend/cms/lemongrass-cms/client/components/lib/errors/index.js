import React from 'react'
import Error403 from './error403'
import Error500 from './error500'

const ErrorsPage = ({ errorInfo }) => {
  switch (errorInfo.errorCode) {
    case 403:
      return <Error403 />
    case 500:
      return <Error500 />

    default:
      return null
  }
}

export default ErrorsPage
