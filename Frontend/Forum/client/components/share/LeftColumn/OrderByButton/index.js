import React from 'react';
import PropTypes from 'prop-types';

import ListOptions from './ListOptions';
import IfComponent from '../../IfComponent';

const propTypes = {
  orderByType: PropTypes.string,
  enableOrderButton: PropTypes.bool,
  orderByOnChange: PropTypes.func,
};

const defaultProps = {
  orderByType: 'LatestComment',
  enableOrderButton: false,
  orderByOnChange: () => { },
};

class OrderByButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: false,
    };

    this.onBlur = this.onBlur.bind(this);
    this.toggleMenuOptions = this.toggleMenuOptions.bind(this);
  }

  onBlur(event) {
    const currentTarget = event.currentTarget;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.setState({
          openMenu: false,
        });
      }
    }, 0);
  }

  toggleMenuOptions(event) {
    const { openMenu } = this.state;
    if (openMenu && this.listOptions.textInfo === document.activeElement) {
      return;
    }
    this.setState({
      openMenu: !openMenu,
    });
  }

  render() {
    const { enableOrderButton, orderByType, orderByOnChange } = this.props;
    const enableState = enableOrderButton ? '' : 'no-access';
    const { openMenu } = this.state;

    const iconText = orderByType === 'LatestThread' ? 'list' : 'sort';
    return (
      <div className={`bn_topbar__setting__filter-orderby bn_display-flex ${enableState}`}>
        <div
          className="bn_topbar__setting__filter-orderby__dropdown"
          role="button"
          tabIndex="-1"
          onClick={this.toggleMenuOptions}
          onBlur={this.onBlur}
        >
          <span className="bn_topbar__setting__filter-orderby__status">
            <span className="material-icons">{iconText}</span>
          </span>
          <IfComponent
            condition={openMenu}
            whenTrue={(
              <ListOptions
                ref={(el) => { this.listOptions = el; }}
                orderByType={orderByType}
                onClickItem={orderByOnChange}
              />
            )}
            whenFalse={null}
          />
        </div>
      </div>
    );
  }
}

OrderByButton.propTypes = propTypes;
OrderByButton.defaultProps = defaultProps;

export default OrderByButton;
