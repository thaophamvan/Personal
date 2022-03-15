import React from 'react'
import PropTypes from 'prop-types'
import Icon from '../../components/icon/icon'

const NewTab = ({ onClick }) => (
  <li className="klara-ui-tabs__add-tab" onClick={onClick}>
    <div className="klara-ui-tabs__add-tab__background">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="30" viewBox="0 0 36 30">
        <path d="M6.18321802,0.5 C5.56451913,0.5 4.9502548,0.604391599 4.36629068,0.80877904 C1.49925851,1.8122403 -0.0114642025,4.94989517 0.991997057,7.81692734 L6.80046533,24.412551 C7.44367636,26.2502968 7.81712551,26.9719989 8.42417571,27.6740088 C8.95870547,28.2921541 9.59635671,28.7445556 10.3563804,29.0448714 C11.2195177,29.3859315 12.0240713,29.5 13.9711281,29.5 L29.769446,29.5 C30.3881448,29.5 31.0024092,29.3956084 31.5863733,29.191221 C34.4534055,28.1877597 35.9641282,25.0501048 34.9606669,22.1830727 L29.1521986,5.58744902 C28.5089876,3.74970323 28.1355385,3.02800115 27.5284883,2.32599117 C26.9939585,1.70784588 26.3563073,1.25544444 25.5962835,0.955128625 C24.7331463,0.614068513 23.9285926,0.5 21.9815359,0.5 L6.18321802,0.5 Z" />
      </svg>
    </div>
    <Icon className="klara-ui-tabs__add-tab__icon" small shape="add" type="inverted" />
  </li>
)

NewTab.propTypes = {
  onClick: PropTypes.func,
}

NewTab.defaultProps = {
  onClick: () => {},
}

export default NewTab
