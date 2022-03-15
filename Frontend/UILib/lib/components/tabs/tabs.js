import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Tab from './tab';
import NewTab from './newTab';
import OverflowIndicator from './overflowIndicator';

const OVERFLOW_THRESHOLD = 20;
const SCROLL_STEP = 180;
const SCROLL_STEP_FRAME = 10;

class Tabs extends React.Component {
  state = {
    overflowingLeft: false,
    overflowingRight: false,
    scrollTarget: null,
  };

  componentDidMount() {
    this.checkOverflows();

    this.containerRef.addEventListener('scroll', this.checkOverflows);
    window.addEventListener('resize', this.checkOverflows);
  }

  componentDidUpdate(prevProps) {
    if (this.props.tabs.length === prevProps.tabs.length + 1) {
      this.containerRef.scrollLeft = this.containerRef.scrollWidth;
    }
  }

  componentWillUnmount() {
    this.containerRef.removeEventListener('scroll', this.checkOverflows);
    window.removeEventListener('resize', this.checkOverflows);
  }

  onLeftOverflowIndicatorClick = () => {
    this.setState(
      { scrollTarget: this.containerRef.scrollLeft - SCROLL_STEP },
      () => {
        requestAnimationFrame(this.scrollAnimationFrame);
      }
    );
  };

  onRightOverflowIndicatorClick = () => {
    this.setState(
      { scrollTarget: this.containerRef.scrollLeft + SCROLL_STEP },
      () => {
        requestAnimationFrame(this.scrollAnimationFrame);
      }
    );
  };

  scrollAnimationFrame = () => {
    const { scrollTarget } = this.state;
    const { scrollLeft: currentPosition } = this.containerRef;

    if (scrollTarget) {
      if (Math.abs(scrollTarget - currentPosition) < SCROLL_STEP_FRAME) {
        this.containerRef.scrollLeft = scrollTarget;
        this.setState({ scrollTarget: null });
      } else if (scrollTarget > currentPosition) {
        this.containerRef.scrollLeft += SCROLL_STEP_FRAME;
      } else {
        this.containerRef.scrollLeft -= SCROLL_STEP_FRAME;
      }

      requestAnimationFrame(this.scrollAnimationFrame);
    }
  };

  containerRefCallback = el => {
    this.containerRef = el;
  };

  checkOverflows = () => {
    const { scrollLeft, scrollWidth, clientWidth } = this.containerRef;

    const overflowingLeft = scrollLeft > OVERFLOW_THRESHOLD;
    const overflowingRight =
      scrollLeft + clientWidth + OVERFLOW_THRESHOLD < scrollWidth;

    this.setState({ overflowingLeft, overflowingRight });
  };

  render() {
    const { overflowingLeft, overflowingRight } = this.state;
    const {
      activeTab,
      tabs,
      onTabClose,
      onTabClick,
      onNewTabClick,
    } = this.props;

    return (
      <div className="klara-ui-tabs">
        <OverflowIndicator
          direction="left"
          visible={overflowingLeft}
          onClick={this.onLeftOverflowIndicatorClick}
        />
        <OverflowIndicator
          direction="right"
          visible={overflowingRight}
          onClick={this.onRightOverflowIndicatorClick}
        />
        <div className="klara-ui-tabs__inner" ref={this.containerRefCallback}>
          <TransitionGroup className="klara-ui-tabs__transition-group">
            {tabs.map(tab => (
              <CSSTransition
                key={tab.id}
                timeout={150}
                classNames="klara-ui-tabs__tab"
              >
                <Tab
                  onClose={() => onTabClose(tab)}
                  onClick={() => onTabClick(tab)}
                  active={tab.id === activeTab}
                  mortal={tabs.length > 1}
                  {...tab}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
          <NewTab onClick={onNewTabClick} />
        </div>
      </div>
    );
  }
}

Tabs.NewTab = NewTab;
Tabs.Tab = Tab;

Tabs.propTypes = {
  activeTab: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
  onTabClose: PropTypes.func,
  onTabClick: PropTypes.func,
  onNewTabClick: PropTypes.func,
};

Tabs.defaultProps = {
  activeTab: null,
  tabs: [],
  onTabClose: () => {},
  onTabClick: () => {},
  onNewTabClick: () => {},
};

Tabs.propsDescriptions = {};

export default Tabs;
