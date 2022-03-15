import React from 'react';

import PropTypes from 'prop-types';
import ActionMenuItem from './ActionMenuItem';

const propTypes = {
  className: PropTypes.string,
  editPermission: PropTypes.bool,
  reportPermission: PropTypes.bool,
  editClicked: PropTypes.func,
  reportClicked: PropTypes.func,
};

const defaultProps = {
  className: '',
  editPermission: false,
  reportPermission: false,
  editClicked: () => {},
  reportClicked: () => {},
};

class MainTopicRightMenu extends React.Component {
  constructor(props) {
    super(props);
    const showRightMenu = false;
    this.state = {
      showRightMenu,
    };
    this.toggleRightMenu = this.toggleRightMenu.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  onBlur(event) {
    const currentTarget = event.currentTarget;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({
          showRightMenu: false,
        });
      }
    }, 0);
  }
  toggleRightMenu() {
    const { showRightMenu } = this.state;
    this.setState({
      showRightMenu: !showRightMenu,
    });
  }
  render() {
    const { className, editPermission, reportPermission,
      editClicked, reportClicked } = this.props;
    const { showRightMenu } = this.state;
    const contextualClasses = showRightMenu ? 'active' : '';
    return (
      <div
        tabIndex="-1"
        className={`bn_thread-comment-menu__dot bn_topbar-share--icon ${className} ${contextualClasses}`}
        onClick={this.toggleRightMenu}
        onBlur={this.onBlur}
        role="button"
      >
        <div className="userActions bn_thread-comment-menu__list">
          <ActionMenuItem
            hasPermission={reportPermission}
            text="Anmäl inlägget"
            title="Anmäl inlägget"
            onClick={reportClicked}
          />
          <ActionMenuItem
            hasPermission={editPermission}
            text="Redigera"
            title="Redigera"
            onClick={editClicked}
          />
        </div>
      </div>
    );
  }
}

MainTopicRightMenu.propTypes = propTypes;
MainTopicRightMenu.defaultProps = defaultProps;

export default MainTopicRightMenu;
