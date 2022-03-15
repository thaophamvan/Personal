import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Router, Route, Switch } from 'react-router-dom'
import { I18n } from 'react-i18next'
import { history } from './utilities/history'
import Home from './components/home'
import DrinkTypeRoute from './containers/drinkType'
import DrinkTypeNewRoute from './components/drinkType/drinkTypeNewForm'
import DrinkTypeEditRoute from './components/drinkType/drinkTypeEditForm'
import DrinkTemperatureRoute from './containers/drinkTemperature'
import DrinkTemperatureNewRoute from './components/drinkTemperature/drinkTemperatureNewForm'
import DrinkTemperatureEditRoute from './components/drinkTemperature/drinkTemperatureEditForm'
import AutoDose from './containers/autoDose'
import AutoDoseNewForm from './components/autoDose/autoDoseNewForm'
import AutoDoseEditForm from './components/autoDose/autoDoseEditForm'
import Localization from './containers/localization'
import Setting from './components/localization/localizationSettingForm'
import Historical from './containers/historical'
import UserPermissonContainer from './containers/userPermission'
import Loader from './components/lib/loader'
import SideNav from './components/sideNav'
import NavBar from './components/navBar'
import Error404 from './components/lib/errors/error404'

const propTypes = {
  loader: PropTypes.bool,
  isAuthentication: PropTypes.bool,
}

const defaultProps = {
  loader: PropTypes.bool,
  isAuthentication: PropTypes.bool,
}
/*eslint-disable */
class App extends React.Component {
  render() {
    const { loader, isAuthentication } = this.props
    return (
      <React.Fragment>
        {
          isAuthentication
            ? (
              <I18n ns="translations">
                {
                  (t, { i18n }) => (
                    <React.Fragment>
                      <Router history={history}>
                        <React.Fragment>

                          <NavBar />

                          <div className="lg_main">
                            {loader && <Loader />}
                            {<SideNav />}
                            <Switch>
                              {/* <Route path="/login" component={LoginForm} exact/> */}
                              <Route path="/" component={Home} exact />
                              <Route path="/drink-type" component={DrinkTypeRoute} exact />
                              <Route path="/drink-type/new" component={DrinkTypeNewRoute} exact />
                              <Route path="/drink-type/:id/edit" component={DrinkTypeEditRoute} exact />
                              <Route path="/drink-temperature" component={DrinkTemperatureRoute} exact />
                              <Route path="/drink-temperature/new" component={DrinkTemperatureNewRoute} exact />
                              <Route path="/drink-temperature/:id/edit" component={DrinkTemperatureEditRoute} exact />
                              <Route path="/auto-dose" component={AutoDose} exact />
                              <Route path="/auto-dose/new" component={AutoDoseNewForm} exact />
                              <Route path="/auto-dose/:id/edit" component={AutoDoseEditForm} exact />
                              <Route path="/localization" component={Localization} exact />
                              <Route path="/localization/setting" component={Setting} exact />
                              <Route path="/historical" component={Historical} exact />
                              <Route path="/user-permission" component={UserPermissonContainer} exact />
                              <Route component={Error404} />
                            </Switch>
                          </div>
                        </React.Fragment>
                      </Router>
                    </React.Fragment>
                  )
                }
              </I18n>
            )
            : <span />
        }
      </React.Fragment>
    )
  }
}

App.propTypes = propTypes
App.defaultProps = defaultProps

const mapStateToProps = function (state) {
  return {
    loader: state.loader,
    isAuthentication: state.user.isAuthentication,
  }
}

export default connect(mapStateToProps)(App)
