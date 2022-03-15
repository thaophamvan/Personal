import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  removeFavorite,
  removeIgnore,
  addFavorite,
  addIgnore,
} from '../../actions';

import { Help, IfComponent, LoadingAnimationComponent } from '../share';
import TopBar from './TopBar';
import MainUserProfile from './MainUserProfile';
import UserProfileError from './UserProfileError';
import { validateAuthorization } from '../../utilities';

const propTypes = {
  profile: PropTypes.shape({
    DateCreated: PropTypes.string,
    VisitCount: PropTypes.number,
    LogTime: PropTypes.shape({}),
    DateLastVisit: PropTypes.string,
    ThreadCount: PropTypes.number,
    MessageCount: PropTypes.number,
    InfoReadCount: PropTypes.number,
    Alias: PropTypes.string,
    IsFavoriteCount: PropTypes.number,
    Info: PropTypes.string,
  }),
  credentials: PropTypes.shape({}),
  columnHeight: PropTypes.number,
  onRemoveFavorite: PropTypes.func,
  onRemoveIgnore: PropTypes.func,
  onAddFavorite: PropTypes.func,
  onAddIgnore: PropTypes.func,
};

const defaultProps = {
  profile: {
    DateCreated: '',
    Alias: '',
    Info: '',
    ThreadCount: 0,
    MessageCount: 0,
    InfoReadCount: 0,
    IsFavoriteCount: 0,
    TotalHours: 0,
    LogTime: {},
  },
  credentials: {},
  columnHeight: 0,
  onRemoveFavorite: () => { },
  onRemoveIgnore: () => { },
  onAddFavorite: () => { },
  onAddIgnore: () => { },
};

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    const showHelp = false;
    this.state = {
      showHelp,
    };
    this.toggleHelp = this.toggleHelp.bind(this);
  }
  toggleHelp() {
    const { showHelp } = this.state;
    this.setState({
      showHelp: !showHelp,
    });
  }

  render() {
    const { showHelp } = this.state;
    const {
      credentials,
      columnHeight,
      profile,
      onRemoveFavorite,
      onRemoveIgnore,
      onAddFavorite,
      onAddIgnore } = this.props;
    const isAuthorized = validateAuthorization(credentials);
    const showButtonsBar = isAuthorized && profile.UserId !== credentials.UserId;
    return (
      <LoadingAnimationComponent>
        <IfComponent
          condition={profile.IsSuccess}
          whenTrue={(
            <div className="bn_profile">
              <TopBar infoClicked={this.toggleHelp} />
              <MainUserProfile
                columnHeight={columnHeight}
                showButtonsBar={showButtonsBar}
                addIgnore={() => onAddIgnore(profile.UserId)}
                addFavorite={() => onAddFavorite(profile.UserId)}
                removeIgnore={() => onRemoveIgnore(profile.UserId)}
                removeFavorite={() => onRemoveFavorite(profile.UserId)}
                profile={profile}
              />
              <Help
                onCloseClicked={this.toggleHelp}
                showHelp={showHelp}
                title="Se vem denna användaren är"
              >
                <h2>Om användarsidan</h2>
                <span>Här hittar du statistik - inloggad tid, aktivitetsnivå -
              och annan intressant information om börssnackare.
                            Varje användare har också möjlighet att presentera sig själv.</span>
                <p>
                  <strong>Lägg till användare som favorit:</strong>
                  <br />
                  <span>Klicka på “Lägg till i mina favoriter” när du är inloggad.
                På samma sätt kan du ta bort som favorit.</span>
                </p>
                <p>
                  <strong>Ignorera användare:</strong><br />
                  <span>Blir du irriterad varje gång du läser en annan börssnackares inlägg?
                Klicka på “Ignorera användare” när du är inloggad,
                    och den användarens kommentarer döljs för dig. På samma sätt kan du ta bort som ignorerad.</span>
                </p>
              </Help>
            </div>
          )}
          whenFalse={(
            <UserProfileError />
          )}
        />
      </LoadingAnimationComponent>
    );
  }
}

UserProfile.propTypes = propTypes;
UserProfile.defaultProps = defaultProps;

const mapStateToProps = state => ({
  profile: state.user.profile,
  columnHeight: state.app.columnHeight,
  credentials: state.app.credentials,
});

const mapDispatchToProps = dispatch => ({
  onRemoveFavorite: userId => dispatch(removeFavorite(userId)),
  onRemoveIgnore: userId => dispatch(removeIgnore(userId)),
  onAddFavorite: userId => dispatch(addFavorite(userId)),
  onAddIgnore: userId => dispatch(addIgnore(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
