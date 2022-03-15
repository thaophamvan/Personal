import React from 'react';
import PropTypes from 'prop-types';

import NavItem from './NavItem';
import VisibleWhen from '../VisibleWhen';

import './MoreMenu.scss';

const propTypes = {
  moreItems: PropTypes.arrayOf(PropTypes.shape({

  })),
};

const defaultProps = {
  moreItems: [],
};

class MoreMenu extends React.Component {
  constructor(props) {
    super(props);
    const { moreItems } = this.props;

    this.setupState = this.setupState.bind(this);
    this.toggleMoreMenu = this.toggleMoreMenu.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.setupState(moreItems);
  }
  componentWillReceiveProps(props) {
    const { moreItems } = props;
    this.setupState(moreItems);
  }
  onBlur(event) {
    const currentTarget = event.currentTarget;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({
          showMoreMenu: false,
        });
      }
    }, 0);
  }
  setupState(moreItems) {
    const isVisible = moreItems.length > 0;
    const showMoreMenu = false;
    this.state = {
      isVisible,
      showMoreMenu,
    };
  }
  toggleMoreMenu() {
    const { showMoreMenu } = this.state;
    this.setState({
      showMoreMenu: !showMoreMenu,
    });
  }
  render() {
    const { isVisible, showMoreMenu } = this.state;
    const { moreItems } = this.props;

    if (isVisible) {
      return (
        <li onBlur={this.onBlur} className="bn_top-nav__item bn_top-nav__item--more">
          <i
            className="material-icons icon-menu--more"
            role="button"
            tabIndex="-1"
            onClick={this.toggleMoreMenu}
          >expand_more</i>
          <VisibleWhen when={showMoreMenu}>
            <ul className="bn_top-nav__menu-more">
              {
                moreItems.map(item => (
                  <NavItem key={item.menuName} {...item} />
                ))
              }
            </ul>
          </VisibleWhen>
        </li>
      );
    }

    return null;
  }
}

MoreMenu.propTypes = propTypes;
MoreMenu.defaultProps = defaultProps;

export default MoreMenu;

