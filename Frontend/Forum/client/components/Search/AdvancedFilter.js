import React, { PropTypes } from 'react';

import AdvancedFilterItem from './AdvancedFilterItem';

const propTypes = {
  searchExactlyOnChange: PropTypes.func,
  searchTypeOnChange: PropTypes.func,
  searchExactly: PropTypes.bool,
  searchType: PropTypes.string,
};

const defaultProps = {
  searchExactlyOnChange: () => { },
  searchTypeOnChange: () => { },
  searchExactly: false,
  searchType: 'simple',
};

const AdvancedFilter = ({ searchExactly, searchType, searchExactlyOnChange, searchTypeOnChange }) => (
  <div className="advancedFeaturesWrapper bn_search-advanced">
    <AdvancedFilterItem
      isRadio={false}
      value="true"
      isChecked={searchExactly}
      onChange={searchExactlyOnChange}
      id="searchExactly"
      text="Exakt"
    />
    <AdvancedFilterItem
      isRadio
      value="simple"
      isChecked={searchType === 'simple'}
      onChange={searchTypeOnChange}
      name="mainSearch"
      id="searchSimple"
      text="Standard"
    />
    <AdvancedFilterItem
      isRadio
      value="subject"
      isChecked={searchType === 'subject'}
      onChange={searchTypeOnChange}
      name="mainSearch"
      id="searchSubject"
      text="Rubriker"
    />
    <AdvancedFilterItem
      isRadio
      value="body"
      isChecked={searchType === 'body'}
      onChange={searchTypeOnChange}
      name="mainSearch"
      id="searchBody"
      text="Texter"
    />
    <AdvancedFilterItem
      isRadio
      value="author"
      isChecked={searchType === 'author'}
      onChange={searchTypeOnChange}
      name="mainSearch"
      id="searchAuthor"
      text="Författare"
    />
    <AdvancedFilterItem
      isRadio
      value="user"
      isChecked={searchType === 'user'}
      onChange={searchTypeOnChange}
      name="mainSearch"
      id="searchUser"
      text="Användare"
    />
  </div>
);

AdvancedFilter.propTypes = propTypes;
AdvancedFilter.defaultProps = defaultProps;

export default AdvancedFilter;
