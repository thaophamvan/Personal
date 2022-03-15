import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { TextEditor } from '../share';
import SaveButton from './SaveButton';
import OptionUnmark from './OptionUnmark';
import OptionShowName from './OptionShowName';
import UserSettingsError from './UserSettingsError';
import { updateUserSettings } from '../../actions';
import { scrollTop } from '../../utilities';

const propTypes = {
  settings: PropTypes.shape({
    Alias: PropTypes.string,
    AutomaticUnmark: PropTypes.bool,
    Email: PropTypes.string,
    ShowMyName: PropTypes.bool,
    UserId: PropTypes.number,
    UserInfo: PropTypes.string,
    IsSuccess: false,
  }),
  onUpdateUserSettings: PropTypes.func,
};

const defaultProps = {
  settings: {},
  onUpdateUserSettings: () => { },
};

class MainUserSettings extends React.Component {
  constructor(props) {
    super(props);
    this.saveUserSettings = this.saveUserSettings.bind(this);
    this.setupState = this.setupState.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.setupState(props.settings);
  }
  componentWillReceiveProps(nextProps) {
    this.setupState(nextProps.settings);
  }
  setupState(settings) {
    this.state = {
      settings,
    };
    this.userInfo = settings.UserInfo || '';
  }
  handleChange(field, value) {
    const curSettings = { ...this.state.settings };
    curSettings[field] = value;
    this.setState({ settings: curSettings });
  }
  updateUserInfo(userInfo) {
    this.userInfo = userInfo;
  }
  saveUserSettings() {
    const settings = { ...this.state.settings };
    settings.UserInfo = this.userInfo;
    this.props.onUpdateUserSettings(settings);
  }
  render() {
    const { settings } = this.state;
    const errorPage = (<UserSettingsError />);
    const mainSettings = (
      <div className="bn_user-settings__content">
        <h1 className="bn_user-settings__headline">Ändra dina inställningar {settings.Alias}</h1>
        <SaveButton onClick={this.saveUserSettings} />
        <div className="bn_user-settings__topic">
          <h2 className="bn_user-settings__sub-headline">Info</h2>
          <div className="settingWrapper">
            <p>Här kan du skriva några rader om dig själv, de visas när man klickar på ditt användarnamn.</p>
            <TextEditor
              id="text-editor-usersettings"
              content={this.userInfo}
              onChange={this.updateUserInfo}
              autoFocus={false}
            />
          </div>
        </div>

        <div className="bn_user-settings__topic">
          <h2 className="bn_user-settings__sub-headline">Mina e-postadress</h2>
          <div className="bn_user-settings__wrapper"><span className="subText">{settings.Email}</span></div>
        </div>

        <OptionUnmark
          selectedOption={settings.AutomaticUnmark}
          onChange={value => this.handleChange('AutomaticUnmark', value)}
        />
        <OptionShowName
          selectedOption={settings.ShowMyName}
          onChange={value => this.handleChange('ShowMyName', value)}
        />

        <div className="bn_user-settings__topic">
          <div className="bn_user-settings__wrapper">
            <Link to="/usersettings/favorites" onClick={scrollTop} className="bn_user-settings__link">
              Lista mina favoriter
            </Link>
          </div>
        </div>

        <div className="bn_user-settings__topic">
          <div className="bn_user-settings__wrapper">
            <Link to="/usersettings/ignores" onClick={scrollTop} className="bn_user-settings__link">
              Mina ignorerade användare
            </Link>
          </div>
        </div>
        <SaveButton onClick={this.saveUserSettings} />
      </div>
    );
    return settings.IsSuccess ? mainSettings : errorPage;
  }
}

MainUserSettings.propTypes = propTypes;
MainUserSettings.defaultProps = defaultProps;

const mapStateToProps = state => ({
  settings: state.user.settings,
});

const mapDispatchToProps = dispatch => ({
  onUpdateUserSettings: (settings) => {
    dispatch(updateUserSettings(settings));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MainUserSettings);
