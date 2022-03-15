import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const propTypes = {
  name: PropTypes.string,
  menuName: PropTypes.string,
  count: PropTypes.number,
  isDefault: PropTypes.bool,
};

const defaultProps = {
  name: '',
  menuName: '',
  count: 0,
  isDefault: false,
};

const FooterForumItem = ({ name, menuName, count, isDefault }) => (
  <li className="bn_statistic__item">
    <Link
      to={`/${isDefault ? '' : menuName}`}
      className="forumLink bn_statistic__link"
    >
      {name}
    </Link>
    <span className="comments bn_statistic__dotted" />
    <span className="comments bn_statistic__comment-count">{count}</span>
  </li>
);

FooterForumItem.propTypes = propTypes;
FooterForumItem.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => ({
  count: state.app.statistic[ownProps.menuName],
});
const mapDispatchToProp = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProp)(FooterForumItem);
