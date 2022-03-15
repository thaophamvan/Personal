import React from 'react';
import PropTypes from 'prop-types';

import {
  RefreshButton, InfoButton, DropDown,
  Help, HideMobile, TopBar as SharedTopBar, ShowMobile,
} from '../share';
import ToggleFollowMobileButton from './ToggleFollowMobileButton';
import TopBarSharing from './TopBarSharing';
import TopBarMobileSharing from './TopBarMobileSharing';

const propTypes = {
  className: PropTypes.string,
  selectedSortOption: PropTypes.string,
  hasAccess: PropTypes.bool,
  sortOptionChanged: PropTypes.func,
  refreshClicked: PropTypes.func,
  sortOptions: PropTypes.arrayOf(PropTypes.shape({
  })),
  commentCount: PropTypes.number,
  onFollow: PropTypes.func,
  onUnFollow: PropTypes.func,
  isFollowEnable: PropTypes.bool,
  shareLink: PropTypes.shape({}),
};

const defaultProps = {
  onFollow: () => { },
  onUnFollow: () => { },
  selectedSortOption: '',
  className: '',
  hasAccess: false,
  sortOptionChanged: () => { },
  refreshClicked: () => { },
  sortOptions: [],
  commentCount: 0,
  isFollowEnable: false,
  shareLink: {},
};

class TopBar extends React.Component {
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
    const { className, hasAccess, sortOptionChanged,
      refreshClicked, sortOptions, selectedSortOption, commentCount,
      onFollow, onUnFollow, isFollowEnable, shareLink } = this.props;
    const { showHelp } = this.state;
    return (
      <div className={`bn_topbar__wrapper ${className}`}>
        <SharedTopBar className="bn_topbar--blue">
          <RefreshButton onClick={refreshClicked} />
          <ShowMobile>
            <TopBarMobileSharing shareLink={shareLink} />
          </ShowMobile>
          <span className="bn_topbar-space" />
          <ShowMobile>
            <ToggleFollowMobileButton
              hasAccess={hasAccess}
              onFollow={onFollow}
              onUnFollow={onUnFollow}
              isFollowEnable={isFollowEnable}
            />
          </ShowMobile>
          <ShowMobile>
            <span className="bn_button__answers-count bn_box__icon" href="#">{commentCount}</span>
          </ShowMobile>
          <HideMobile>
            <InfoButton title="Så fungerar trådlistan" onClick={this.toggleHelp} />
          </HideMobile>
        </SharedTopBar>
        <SharedTopBar className="bn_topbar--grey">
          <div className="bn_topbar-filter bn_main__filter bn_display-flex">
            <DropDown
              items={sortOptions}
              className="bn_topbar-filter__list-sort"
              onChange={sortOptionChanged}
              selectedValue={selectedSortOption}
            />
          </div>
          <HideMobile>
            <TopBarSharing shareLink={shareLink} />
          </HideMobile>
        </SharedTopBar>
        <Help onCloseClicked={this.toggleHelp} showHelp={showHelp} title="Så fungerar trådlistan">
          <h2>Så kommenterar du</h2>
          <p>Här kan du se kommentarerna i den tråd du valt. Den första kommentaren är själva starten för tråden.</p>
          <p><strong>1) Så här skapar du en kommentar:</strong>&nbsp;</p>
          <p>Du måste vara registrerad användare och inloggad. Klicka på
            <strong>”Kommentera”</strong>-knappen längst ner.
            &nbsp;När du tryckt på publicera-knappen visas din nya kommentar i listan.&nbsp;
            I anslutning till kommentaren visas vem som skrivit den, och när.
            Om du klickar på namnet kommer du till dennes användarsida.
            Här kan du både välja att följa – men också ignorera – den börssnackaren.</p>
          <p>
            <strong>2) Så här anmäler du en kommentar:</strong>&nbsp;
          </p>
          <p>Om du anser att en kommentar bryter mot reglerna för Börssnack kan du anmäla den till moderatorn.
            Klicka på den så kallade ”köttbullsmenyn” (de tre punkterna),
            så dyker en länk upp som du kan klicka på för att skicka en anmälan.
          </p>
        </Help>
      </div>
    );
  }
}

TopBar.propTypes = propTypes;
TopBar.defaultProps = defaultProps;

export default TopBar;
