import React, { PropTypes } from 'react';
import ActionMenuItem from './ActionMenuItem';
import { IfComponent } from '../share';

const propTypes = {
  hasAccess: PropTypes.bool,
  editPermission: PropTypes.bool,
  reportPermission: PropTypes.bool,
  toggleIgnoredPermission: PropTypes.bool,
  deletePermission: PropTypes.bool,
  editClicked: PropTypes.func,
  reportClicked: PropTypes.func,
  deleteClicked: PropTypes.func,
  ignoredUser: PropTypes.bool,
  toggleIgnored: PropTypes.func,
  ignoredMenuState: PropTypes.bool,
  number: PropTypes.number,
};

const defaultProps = {
  hasAccess: false,
  editPermission: false,
  reportPermission: false,
  toggleIgnoredPermission: false,
  deletePermission: false,
  editClicked: () => { },
  reportClicked: () => { },
  deleteClicked: () => { },
  ignoredUser: false,
  toggleIgnored: () => { },
  ignoredMenuState: false,
  number: 0,
};

class CommentItemRightMenu extends React.Component {
  constructor(props) {
    super(props);
    const showRightMenu = false;
    this.state = {
      showRightMenu,
    };
    this.toogleMenu = this.toogleMenu.bind(this);
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
  toogleMenu() {
    const { showRightMenu } = this.state;
    this.setState({
      showRightMenu: !showRightMenu,
    });
  }
  render() {
    const { hasAccess, reportPermission, editPermission, deletePermission,
      reportClicked, editClicked, deleteClicked, toggleIgnoredPermission,
      ignoredUser, toggleIgnored, ignoredMenuState, number,
    } = this.props;
    const { showRightMenu } = this.state;
    const stateClass = showRightMenu ? 'active' : '';
    const ignoredMenuText = ignoredMenuState ? 'Dölj' : 'Visa';
    const ignoredMenu = ignoredUser ? (<ActionMenuItem
      hasPermission={toggleIgnoredPermission}
      text={ignoredMenuText}
      title={ignoredMenuText}
      onClick={toggleIgnored}
    />) : null;

    return (
      <div className={`bn_thread-comment-menu ${number > 0 ? 'bn_display-flex' : ''}`}>
        <IfComponent
          condition={number > 0}
          whenTrue={
            <span
              className={`bn_thread-comment-menu__number ${hasAccess ? '' : 'alone'}`}
            >
              #{number}
            </span>
          }
          whenFalse={null}
        />
        <IfComponent
          condition={hasAccess}
          whenTrue={
            <div
              onClick={this.toogleMenu}
              onBlur={this.onBlur}
              className={`bn_thread-comment-menu__dot bn_topbar-share--icon ${stateClass}`}
              role="button"
              tabIndex="-1"
            >
              <div className="userActions displayOnHover bn_thread-comment-menu__list">
                <ActionMenuItem
                  onClick={reportClicked}
                  hasPermission={reportPermission}
                  text="Anmäl inlägget"
                  title="Anmäl inlägg"
                />
                <ActionMenuItem
                  hasPermission={editPermission}
                  text="Redigera"
                  title="Redigera"
                  onClick={editClicked}
                />
                <ActionMenuItem
                  hasPermission={deletePermission}
                  text="Radera"
                  title="Radera"
                  onClick={deleteClicked}
                />
                {ignoredMenu}
              </div>
            </div>
          }
          whenFalse={null}
        />
      </div>
    );
  }
}

CommentItemRightMenu.propTypes = propTypes;
CommentItemRightMenu.defaultProps = defaultProps;

export default CommentItemRightMenu;
