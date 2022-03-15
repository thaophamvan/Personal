import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { BackButton, VisibleWhen } from '../share';
import TableSummary from './TableSummary';
import LatestPost from './LatestPost';
import AboutMe from './AboutMe';
import UserActivities from './UserActivities';
import ToggleFavoriteButton from './ToggleFavoriteButton';
import ToggleIgnoreButton from './ToggleIgnoreButton';

const propTypes = {
  backClicked: PropTypes.func,
  addFavorite: PropTypes.func,
  addIgnore: PropTypes.func,
  removeFavorite: PropTypes.func,
  removeIgnore: PropTypes.func,
  infoClicked: PropTypes.func,
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
    UserId: PropTypes.number,
  }),
  showButtonsBar: PropTypes.bool,
  columnHeight: PropTypes.number,
};

const defaultProps = {
  backClicked: () => { },
  infoClicked: () => { },
  addIgnore: () => { },
  profile: null,
  addFavorite: () => { },
  removeFavorite: () => { },
  removeIgnore: () => { },
  columnHeight: 0,
  showButtonsBar: false,
};

const MainUserProfile = ({ backClicked, infoClicked, profile, columnHeight,
  addFavorite, removeFavorite, addIgnore, removeIgnore, showButtonsBar }) => {
  const isFavoriteAvailable = profile.IsFavorite === 1;
  const isIgnoreAvailable = profile.IsIgnore === 1;
  return (
    <div className="settings userProfile bn_profile__content">
      <BackButton className="hidden" onClick={backClicked} />
      <h1 className="bn_profile__title">Användarinfo {profile.Alias}</h1>
      <div className="userInfo bn_profile">
        <TableSummary {...profile} />
        <VisibleWhen className="bn_profile-follow" when={showButtonsBar}>
          <ToggleFavoriteButton
            isFavorite={isFavoriteAvailable}
            addFavorite={addFavorite}
            removeFavorite={removeFavorite}
          />
          <ToggleIgnoreButton
            isIgnore={isIgnoreAvailable}
            addIgnore={addIgnore}
            removeIgnore={removeIgnore}
          />
        </VisibleWhen>
        <AboutMe infoText={profile.Info} />
        <LatestPost activeForums={profile.ActiveForums} UserId={profile.UserId} alias={profile.Alias} />
        <UserActivities activeForums={profile.ActiveDates} />
      </div>
    </div>
  );
};


MainUserProfile.propTypes = propTypes;
MainUserProfile.defaultProps = defaultProps;

export default withRouter(MainUserProfile);
