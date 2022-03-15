import React from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';

import PreviousButton from '../PreviousButton';
import NextButton from '../NextButton';
import PagingItem from './PagingItem';
import IfComponent from '../IfComponent';
import VisibleWhen from '../VisibleWhen';

const propTypes = {
  totalPages: PropTypes.number,
  currentThreadIndex: PropTypes.number,
  goToPage: PropTypes.func,
};

const defaultProps = {
  totalPages: 0,
  currentThreadIndex: 0,
  goToPage: () => { },
};
const getPageRange = (totalItems, current) => {
  const from = current - 2 > 1 ? current - 2 : 1;
  const to = current + 2 > totalItems ? totalItems : current + 2;
  return { from, to };
};

const previousPage = (currentThreadIndex, totalPages, goToPage) => {
  const newIndex = currentThreadIndex - 1;
  if (newIndex > 0) {
    goToPage(newIndex);
  }
};

const nextPage = (currentThreadIndex, totalPages, goToPage) => {
  const newIndex = currentThreadIndex + 1;
  if (newIndex <= totalPages) {
    goToPage(newIndex);
  }
};

const Paging = ({ totalPages, currentThreadIndex, goToPage }) => {
  const pageRange = getPageRange(totalPages, currentThreadIndex);
  const lastPage = totalPages > 0 ? totalPages : 0;
  const showLastPage = lastPage > 0 && lastPage > pageRange.to;
  const showFirstPage = pageRange.from > 1;
  const showPaging = totalPages > 0;
  const lastPagingElement = (<PagingItem
    isSelected={lastPage === currentThreadIndex}
    onClick={goToPage}
    page={lastPage}
  />);

  const firstPagingElement = (<PagingItem
    isSelected={currentThreadIndex === 1}
    onClick={goToPage}
    page={1}
  />);
  return (
    <VisibleWhen when={showPaging} className="bn_pager">
      <div className="pagination">
        <PreviousButton onClick={() => previousPage(currentThreadIndex, totalPages, goToPage)} />
        <IfComponent
          condition={showFirstPage}
          whenTrue={firstPagingElement}
          whenFalse={null}
        />
        <IfComponent
          condition={pageRange.from > 2}
          whenTrue={<span>...</span>}
          whenFalse={null}
        />
        {
          range(pageRange.from, (pageRange.to + 1)).map(p => (
            <PagingItem isSelected={p === currentThreadIndex} onClick={goToPage} page={p} key={p} />
          ))
        }
        <IfComponent
          condition={pageRange.to + 1 < totalPages}
          whenTrue={<span>...</span>}
          whenFalse={null}
        />
        <IfComponent
          condition={showLastPage}
          whenTrue={lastPagingElement}
          whenFalse={null}
        />
        <NextButton onClick={() => nextPage(currentThreadIndex, totalPages, goToPage)} />
      </div>
    </VisibleWhen>
  );
};

Paging.propTypes = propTypes;
Paging.defaultProps = defaultProps;

export default Paging;
