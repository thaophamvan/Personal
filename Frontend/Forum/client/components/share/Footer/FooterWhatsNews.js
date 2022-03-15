import React from 'react';
import PropTypes from 'prop-types';

import FooterForumItem from './FooterForumItem';
import FooterHeaderTop from './FooterHeaderTop';
import Help from '../Help';

const propTypes = {
  refreshClicked: PropTypes.func,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    menuName: PropTypes.string,
    count: PropTypes.number,
    isDefault: PropTypes.bool,
  })),
};

const defaultProps = {
  refreshClicked: () => {},
  menuItems: [],
};

class FooterWhatsNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHelp: false,
    };

    this.toggleInfo = this.toggleInfo.bind(this);
  }
  toggleInfo() {
    const { showHelp } = this.state;
    this.setState({
      showHelp: !showHelp,
    });
  }
  render() {
    const { showHelp } = this.state;
    const { refreshClicked, menuItems } = this.props;
    return (
      <div className="bn_statistic__left">
        <div className="bn_statistic__new">
          <FooterHeaderTop
            refreshClicked={refreshClicked}
            infoTitle="Olästa inlägg per forum"
            toggleInfo={this.toggleInfo}
          >
            Vad Nytt
          </FooterHeaderTop>
          <div className="bn_statistic__detail">
            <ul className="bn_statistic__list">
              {menuItems.map(menuItem => (
                <FooterForumItem
                  key={menuItem.menuName}
                  name={menuItem.name}
                  menuName={menuItem.menuName}
                  isDefault={menuItem.isDefault}
                />
              ))}
            </ul>
          </div>
        </div>
        <Help
          onCloseClicked={this.toggleInfo}
          showHelp={showHelp}
          title="Olästa inlägg per forum"
        >
          <p>Här kan du se hur många olästa inlägg du har per forum. Klicka på forumet för att se dessa inlägg.</p>
        </Help>
      </div>
    );
  }
}

FooterWhatsNews.propTypes = propTypes;
FooterWhatsNews.defaultProps = defaultProps;

export default FooterWhatsNews;

