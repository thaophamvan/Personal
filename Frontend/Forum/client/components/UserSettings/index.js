import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { InfoButton, Help, LoadingAnimationComponent, TopBar } from '../share';
import MainUserSettings from './MainUserSettings';
import FavoriteSettings from './FavoriteSettings';
import IgnoreSettings from './IgnoreSettings';

const propTypes = {
};

const defaultProps = {
};

class UserSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHelp: false,
    };

    this.toggleInfo = this.toggleInfo.bind(this);
  }
  toggleInfo() {
    const { showHelp } = this.state;
    this.setState({
      showHelp: !showHelp,
    });
  }
  render() {
    const { showHelp } = this.state;
    return (
      <LoadingAnimationComponent>
        <div className="bn_user-settings">
          <div className="bn_topbar__wrapper">
            <TopBar className="bn_topbar--blue">
              <span className="bn_topbar__label">Användarinställningar</span>
              <InfoButton title="Här ändrar du dina inställningar" onClick={this.toggleInfo} />
            </TopBar>
            <div className="bn_user-settings__content">
              <Switch>
                <Route path="/usersettings/favorites" component={FavoriteSettings} />
                <Route path="/usersettings/ignores" component={IgnoreSettings} />
                <Route path="/usersettings" component={MainUserSettings} />
              </Switch>
            </div>
          </div>
          <Help
            onCloseClicked={this.toggleInfo}
            showHelp={showHelp}
            title="Här ändrar du dina inställningar"
          >
            <h2>Om inställningar</h2>
            <p><span>Här ändrar du den <strong>information om dig själv</strong>
              som visas för andra börssnackare. Kom ihåg att samma regler och villkor för din personliga presentation
              gäller som för att skriva kommentarer på Börssnack.</span></p>
            <p><span>Här kan du också <strong>ändra vissa funktioner</strong>,
              som att automatiskt markera trådar och kommentarer som lästa.</span></p>
          </Help>
        </div>
      </LoadingAnimationComponent>
    );
  }
}

UserSettings.propTypes = propTypes;
UserSettings.defaultProps = defaultProps;

const mapStateToProps = state => ({
});


const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
