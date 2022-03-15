import React from 'react';
import PropTypes from 'prop-types';

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

const TopBarSharing = ({ shareLink }) => (
  <div className="bn_topbar-share">
    <Email shareLink={shareLink.email} />
    <Facebook shareLink={shareLink.facebook} />
    <Twitter shareLink={shareLink.twitter} />
    <Linkedin shareLink={shareLink.linkedin} />
  </div>
);

TopBarSharing.propTypes = propTypes;
TopBarSharing.defaultProps = defaultProps;

export default TopBarSharing;
