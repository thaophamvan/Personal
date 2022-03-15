import React from 'react';
import PropTypes from 'prop-types';

import MenuGroup, { menuGroupDataProps } from './MenuGroup';

class GroupedMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openMenu: null };
  }

  openMenuGroup = (openMenu) => {
    this.setState({ openMenu });
  }

  render() {
    return (
      <ul className="style-guide__list">
        {this.props.menuGroups.map(menuGroup => (
          <MenuGroup
            onClick={this.openMenuGroup}
            key={menuGroup.basePath}
            basePath={menuGroup.basePath}
            isOpen={menuGroup.basePath === this.state.openMenu}
            title={menuGroup.title}
            pages={menuGroup.pages}
          />
        ))}
      </ul>
    );
  }
}

GroupedMenu.propTypes = {
  menuGroups: PropTypes.arrayOf(PropTypes.shape(menuGroupDataProps)).isRequired,
};

export default GroupedMenu;
