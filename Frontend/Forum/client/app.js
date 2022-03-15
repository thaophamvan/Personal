import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { syncHistoryWithStore, routerReducer } from "react-router-redux";
import { createBrowserHistory } from "history";
import Loadable from "react-loadable";
import thunk from "redux-thunk";
import isMobile from "ismobilejs";

import { detectBrowser } from "./utilities";

import {
  Header,
  Banner,
  Footer,
  MainLayout,
  MainColumn,
  LeftColumn,
  FooterInfo,
  LoadingAnimation,
  IfComponent,
  Anchor,
} from "./components/share";
import * as reducers from "./reducers";
import { loadMenu, computeSelectedMenu, loadCurrentPage, loadCurrentUser } from "./actions";
import "./style.scss";

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

const defaultProps = {
  history: {},
};

const AsyncStatistic = Loadable({
  loader: () => import("./components/Statistic"),
  loading: LoadingAnimation,
});

const AsyncSearch = Loadable({
  loader: () => import("./components/Search"),
  loading: LoadingAnimation,
});

const AsyncUserSettings = Loadable({
  loader: () => import("./components/UserSettings"),
  loading: LoadingAnimation,
});

const AsyncNewThread = Loadable({
  loader: () => import("./components/NewThread"),
  loading: LoadingAnimation,
});

const AsyncUserProfile = Loadable({
  loader: () => import("./components/UserProfile"),
  loading: LoadingAnimation,
});

const AsyncThread = Loadable({
  loader: () => import("./components/Thread"),
  loading: LoadingAnimation,
});

const App = ({ history }) => (
  <HashRouter history={history}>
    <div className="bn_page__container">
      <Header />
      <Banner />
      <MainLayout>
        <Anchor />
        <LeftColumn />
        <MainColumn>
          <Switch>
            <Route exact path="/statistic" component={AsyncStatistic} />
            <Route exact path="/search" component={AsyncSearch} />
            <Route exact path="/usersettings/:setting?" component={AsyncUserSettings} />
            <Route exact path="/newthread/:forum?" component={AsyncNewThread} />
            <Route exact path="/user/:userId?" component={AsyncUserProfile} />
            <Route exact path="/:forumId?/:threadId?" component={AsyncThread} />
          </Switch>
        </MainColumn>
      </MainLayout>
      <footer className="bn_statistic">
        <Switch>
          <Route exact path="/statistic" component={FooterInfo} />
          <Route path="*" component={Footer} />
        </Switch>
      </footer>
    </div>
  </HashRouter>
);
const MobileApp = ({ history }) => (
  <HashRouter history={history}>
    <div className="bn_page__container mobile-app">
      <Header />
      <Banner />
      <MainLayout>
        <Switch>
          <Route exact path="/:forumId(!statistic|!search|fonder|derivat|webmaster|personal)?" component={LeftColumn} />
          <MainColumn>
            <Switch>
              <Route exact path="/statistic" component={AsyncStatistic} />
              <Route exact path="/search" component={AsyncSearch} />
              <Route exact path="/usersettings/:setting?" component={AsyncUserSettings} />
              <Route exact path="/newthread/:forum?" component={AsyncNewThread} />
              <Route exact path="/user/:userId?" component={AsyncUserProfile} />
              <Route exact path="/:forumId/:threadId" component={AsyncThread} />
            </Switch>
          </MainColumn>
        </Switch>
      </MainLayout>
      <footer className="bn_statistic">
        <Switch>
          <Route exact path="/statistic" component={FooterInfo} />
          <Route path="*" component={Footer} />
        </Switch>
      </footer>
    </div>
  </HashRouter>
);

MobileApp.propTypes = propTypes;
MobileApp.defaultProps = defaultProps;
App.propTypes = propTypes;
App.defaultProps = defaultProps;

const rootReducer = combineReducers({
  ...reducers,
  routing: routerReducer,
});
const store = createStore(rootReducer, applyMiddleware(thunk));

const history = syncHistoryWithStore(createBrowserHistory(), store);

history.listen((location) => {
  if (location) {
    const { menuItems } = store.getState().app;
    store.dispatch(computeSelectedMenu(menuItems, location));
    store.dispatch(loadCurrentPage(location));
  }
});

const ConnectedApp = () => (
  <Provider store={store}>
    <IfComponent
      condition={isMobile.phone}
      whenTrue={<MobileApp history={history} />}
      whenFalse={<App history={history} />}
    />
  </Provider>
);

const loadSekeleton = (s) => {
  detectBrowser();
  s.dispatch(loadMenu(location));
  s.dispatch(loadCurrentPage(location, true));
  s.dispatch(loadCurrentUser(location));
};

loadSekeleton(store);

if ("ontouchstart" in document.documentElement) {
  document.body.style.cursor = "pointer";
}

ReactDOM.render(<ConnectedApp />, document.getElementById("mainContent"));
