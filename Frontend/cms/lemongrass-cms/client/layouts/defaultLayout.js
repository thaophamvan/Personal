import React from 'react'
import PageLayout from './pageLayout'
import SideNav from '../components/sideNav'
import NavBar from '../components/navBar'

/**
 * @extends PageLayout
 * @see https://simonsmith.io/reusing-layouts-in-react-router-4/
 */
/*eslint-disable */
const DefaultLayout = ({ component: Component, ...rest }) => (
  <PageLayout
    {...rest}
    component={matchProps => (
      <React.Fragment>
        <SideNav />
        <NavBar />
        <main className="lg_main">

          <div className="container-fluid p-0">
            <Component {...matchProps} />
          </div>
        </main>
      </React.Fragment>
    )}
  />
)

export default DefaultLayout
