import React from 'react';
import PropTypes from 'prop-types';

import { IfComponent } from '../../share';

import Email from './Email';
import Facebook from './Facebook';
import Twitter from './Twitter';
import Linkedin from './Linkedin';

const propTypes = {
  shareLink: PropTypes.shape({}),
};

const defaultProps = {
  shareLink: {},
};

class TopBarMobileSharing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
    };

    this.onBlur = this.onBlur.bind(this);
    this.toggleShareMenu = this.toggleShareMenu.bind(this);
  }


  onBlur(e) {
    const currentTarget = e.currentTarget;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({
          showMenu: false,
        });
      }
    }, 0);
  }

  toggleShareMenu() {
    const { showMenu } = this.state;
    this.setState({
      showMenu: !showMenu,
    });
  }

  render() {
    const { showMenu } = this.state;
    const { shareLink } = this.props;

    const shareMenu = (
      <ul className="bn_button__share-menu">
        <li>Dela detta med</li>
        <Email shareLink={shareLink.email} />
        <Facebook shareLink={shareLink.facebook} />
        <Twitter shareLink={shareLink.twitter} />
        <Linkedin shareLink={shareLink.linkedin} />
      </ul>
    );

    return (
      <span className="bn_button__share show-mobile">
        <span
          className="bn_box__icon material-icons bn_button__share-holder"
          onClick={this.toggleShareMenu}
          onBlur={this.onBlur}
          role="button"
          tabIndex="-1"
        >
          share
        </span>
        <IfComponent condition={showMenu} whenTrue={shareMenu} whenFalse={null} />
      </span>
    );
  }
}

TopBarMobileSharing.propTypes = propTypes;
TopBarMobileSharing.defaultProps = defaultProps;

export default TopBarMobileSharing;
