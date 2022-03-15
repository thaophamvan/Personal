import React from 'react';
import PropTypes from 'prop-types';
import ListOptionsItem from './ListOptionsItem';

const propTypes = {
  orderByType: PropTypes.string,
  onClickItem: PropTypes.func,
};

const defaultProps = {
  orderByType: '',
  onClickItem: () => { },
};

class ListOptions extends React.Component {
  render() {
    const { orderByType, onClickItem } = this.props;
    return (
      <ul
        className="bn_topbar__setting__filter-orderby__list-options"
      >
        <li
          ref={(el) => { this.textInfo = el; }}
          role="presentation"
          className="bn_topbar__setting__filter-orderby__item-text"
          tabIndex="-1"
        >
          Sortera efter:
        </li>
        <ListOptionsItem
          className="bn_topbar__setting__filter-orderby__item-comment"
          text="Senast kommenterad"
          itemType="LatestComment"
          orderByType={orderByType}
          onClickItem={onClickItem}
        />
        <ListOptionsItem
          className="bn_topbar__setting__filter-orderby__item-thread"
          text="Senast skapad"
          itemType="LatestThread"
          orderByType={orderByType}
          onClickItem={onClickItem}
        />
      </ul>
    );
  }
}

ListOptions.propTypes = propTypes;
ListOptions.defaultProps = defaultProps;

export default ListOptions;
