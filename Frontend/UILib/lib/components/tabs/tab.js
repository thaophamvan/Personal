import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../components/icon/icon';

class Tab extends React.Component {
  state = {
    icon: 'remove_outline',
  };

  onIconClick = e => {
    e.stopPropagation();
    this.props.onClose();
  };

  onIconMouseEnter = () => this.setState({ icon: 'remove' });

  onIconMouseLeave = () => this.setState({ icon: 'remove_outline' });

  render() {
    const { icon } = this.state;
    const { active, mortal, title, onClick } = this.props;

    return (
      <div
        title={title}
        onClick={onClick}
        className={`klara-ui-tabs__tab ${
          active ? 'klara-ui-tabs__tab--active' : ''
        }`}
      >
        <div className="klara-ui-tabs__tab__background">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="177"
            height="40"
            viewBox="0 0 177 40"
          >
            <path d="M0.73184588,40.5 L176.268154,40.5 L163.232374,7.09581383 C162.302472,4.7129402 161.779907,3.77377634 160.955379,2.86426928 C160.224302,2.05784389 159.364958,1.47073664 158.347932,1.08285133 C157.200905,0.645384429 156.136026,0.5 153.578136,0.5 L23.4218642,0.5 C20.8639736,0.5 19.7990948,0.645384429 18.6520676,1.08285133 C17.6350421,1.47073664 16.7756981,2.05784389 16.0446208,2.86426928 C15.2200933,3.77377634 14.6975278,4.7129402 13.7676258,7.09581383 L0.73184588,40.5 Z" />
          </svg>
        </div>
        <span className="klara-ui-tabs__tab__title">{title}</span>
        {mortal && (
          <span
            className="klara-ui-tabs__tab__close"
            onMouseEnter={this.onIconMouseEnter}
            onMouseLeave={this.onIconMouseLeave}
          >
            <Icon shape={icon} small onClick={this.onIconClick} />
          </span>
        )}
      </div>
    );
  }
}

Tab.propTypes = {
  title: PropTypes.string.isRequired,
  active: PropTypes.bool,
  mortal: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};

Tab.defaultProps = {
  active: false,
  mortal: true,
  onClick: () => {},
  onClose: () => {},
};

export default Tab;
