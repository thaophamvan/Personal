/*
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = ({ component: Component, ...rest }) => {
  // Alway load login first when user not expect save state login before
  console.log(`user is ${rest.isAuthentication}`)
  console.log(`rest is ${rest}`)
  return (
    <Route
      {...rest}
      render={props => (
        rest.isAuthentication
          ? <Component {...props} />
          : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )}
    />
  )
}

const mapStateToProps = store => ({
  isAuthentication: store.user.isAuthentication,
})

export default connect(mapStateToProps)(PrivateRoute)
*/
