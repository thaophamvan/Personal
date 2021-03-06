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
            <InfoButton title="S?? fungerar tr??dlistan" onClick={this.toggleHelp} />
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
        <Help onCloseClicked={this.toggleHelp} showHelp={showHelp} title="S?? fungerar tr??dlistan">
          <h2>S?? kommenterar du</h2>
          <p>H??r kan du se kommentarerna i den tr??d du valt. Den f??rsta kommentaren ??r sj??lva starten f??r tr??den.</p>
          <p><strong>1) S?? h??r skapar du en kommentar:</strong>&nbsp;</p>
          <p>Du m??ste vara registrerad anv??ndare och inloggad. Klicka p??
            <strong>???Kommentera???</strong>-knappen l??ngst ner.
            &nbsp;N??r du tryckt p?? publicera-knappen visas din nya kommentar i listan.&nbsp;
            I anslutning till kommentaren visas vem som skrivit den, och n??r.
            Om du klickar p?? namnet kommer du till dennes anv??ndarsida.
            H??r kan du b??de v??lja att f??lja ??? men ocks?? ignorera ??? den b??rssnackaren.</p>
          <p>
            <strong>2) S?? h??r anm??ler du en kommentar:</strong>&nbsp;
          </p>
          <p>Om du anser att en kommentar bryter mot reglerna f??r B??rssnack kan du anm??la den till moderatorn.
            Klicka p?? den s?? kallade ???k??ttbullsmenyn??? (de tre punkterna),
            s?? dyker en l??nk upp som du kan klicka p?? f??r att skicka en anm??lan.
          </p>
        </Help>
      </div>
    );
  }
}

TopBar.propTypes = propTypes;
TopBar.defaultProps = defaultProps;

export default TopBar;
