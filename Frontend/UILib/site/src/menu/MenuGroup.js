import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, matchPath } from 'react-router-dom';
import classNames from 'classnames';

import MenuGroupItem, { menuGroupItemDataProps } from './MenuGroupItem';

class MenuGroup extends React.Component {
  openMenuGroup = () => {
    this.props.onClick(this.props.basePath);
  }

  render() {
    const matches = (matchPath(this.props.location.pathname, `${this.props.basePath}*`));

    const menuGroupClasses = classNames('menu-group', {
      'menu-group--active': this.props.isOpen,
    });

    return (
      <li className={menuGroupClasses}>
        <span onClick={this.openMenuGroup} className="menu-group__list-headline">{ this.props.title }</span>
        { (this.props.isOpen || matches) && (
          <ul className="menu-group__list">
            {this.props.pages.map(({ path, label }) => (
              <MenuGroupItem
                basePath={this.props.basePath}
                key={path}
                path={path}
                label={label}
                isOpen={!!matchPath(this.props.location.pathname, this.props.basePath + path)}
                onClick={this.openMenuItem}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }
}

export const menuGroupDataProps = {
  title: PropTypes.string.isRequired,
  pages: PropTypes.arrayOf(PropTypes.shape(menuGroupItemDataProps)).isRequired,
};

MenuGroup.propTypes = {
  ...menuGroupDataProps,
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default withRouter(MenuGroup);

