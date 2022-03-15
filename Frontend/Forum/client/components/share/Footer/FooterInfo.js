import React from 'react';
import './footerinfo.scss';

const propTypes = {

};

const defaultProps = {

};

const FooterInfo = () => (
  <div className="bn_statistic__wrapper bn_statistic__statistic bn_display-flex">
    <div className="bn_statistic-most__footer">
      De kommentarer som skrivs på Börssnack förhandsgranskas inte och kommentatorn är
      personligt ansvarig för det som postas och publiceras.
    </div>
  </div>
);

FooterInfo.propTypes = propTypes;
FooterInfo.defaultProps = defaultProps;

export default FooterInfo;

