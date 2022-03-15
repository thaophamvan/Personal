import { isMobileViewport } from "../../scripts/ultis/devices";

export default class ProductFiltering {
  appliedFilters = [];

  initialFilter = () => {};

  onSubmit = () => {};

  selectedFilter = null;

  constructor(element) {
    this.selector = element;
    this.filtersSelector = this.selector.querySelector('.js_product-filter__filters');
    this.filterCollapses = [...this.filtersSelector.querySelectorAll('.collapse')];
    this.appliedFiltersSelector = this.selector.querySelector('.js_product-filter__applied-filters');
    this.appliedFiltersWrapperSelector = this.selector.querySelector('.js_product-filter__applied-filters-wrapper');
    this.filterItemsSelector = [...this.selector.querySelectorAll('.js_product-filter__filter-item')];
    this.cleanAllFilterBtn = this.selector.querySelector('.js_product-filter__clean-all-filter');
    this.productFilterBodySelector = this.selector.querySelector('.js_product-filter__body');
    this.productFilterBodyWrapperSelector = this.selector.querySelector('.js_product-filter__body-wrapper');
    this.productFilterRemoveBtns = [...this.selector.querySelectorAll('.js_product-filter__remove-filter')];
    this.bindEvents();
    this.setHeightAppliedFilters();

    setTimeout(() => {
      this.productFilterBodySelector.style.height = isMobileViewport()
        //We want to collapse filter at the first load, in mobile
        ? '0' 
        : this.productFilterBodyWrapperSelector.offsetHeight == 0 
          ? 'auto' 
          : `${this.productFilterBodyWrapperSelector.offsetHeight}px`;

    }, 1000);

    this.displayCleanAll();
  }

  getInitialFilter = () => {
    const appliedFilter = [];
    [...this.appliedFiltersSelector.childNodes].forEach((child) => {
      if (child.dataset && !child.classList.contains('disable_unselected')) {
        const { key, text } = child.dataset;
        appliedFilter.push({
          key,
          text,
        });
      }
    });
    return appliedFilter;
  };

  displayCleanAll = () => {
    if ([...this.appliedFiltersSelector.childNodes].filter((node) => node.nodeName !== '#text' && !node.classList.contains('disable_unselected')).length > 0) {
      this.cleanAllFilterBtn.classList.add('show');
    } else {
      this.cleanAllFilterBtn.classList.remove('show');
    }
  };

  bindEvents = () => {
    this.filterItemsSelector.forEach((filterItem) => {
      filterItem.addEventListener('click', this.handleClickFilter(filterItem));
    });
    this.productFilterRemoveBtns.forEach((selector) => {
      const { parentElement } = selector;
      if (parentElement.dataset) {
        const { key, text } = parentElement.dataset;
        this[`${key}-${text}`] = parentElement;
        selector.addEventListener(
          'click',
          this.handleRemoveFilter({
            Key: key,
            Value: text,
          }),
        );
      }
    });
    this.cleanAllFilterBtn.onclick = this.handleCleanAllFilter;
    window.addEventListener('resize', () => {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(() => {
        this.setHeightAppliedFilters();
        setTimeout(() => {
          if (this.productFilterBodySelector.classList.contains('show')) {
            this.productFilterBodySelector.style.height = `${this.productFilterBodyWrapperSelector.offsetHeight}px`;
          }
        }, 500);
      }, 200);
    });
  };

  setHeightAppliedFilters = (height = this.appliedFiltersSelector.offsetHeight) => {
    this.appliedFiltersWrapperSelector.style.height = `${height}px`;
  };

  createAppliedFilters = (appliedFilter) => {
    const { DisplayText, Key, Value } = appliedFilter;
    const el = document.createElement('span');
    el.classList.add('product-filter__applied-filter-item');
    el.classList.add('d-flex');
    el.dataset.key = Key;
    el.dataset.text = Value;
    if (appliedFilter.link) {
      el.dataset.link = true;
    }
    el.innerText = appliedFilter.originText ? appliedFilter.originText.trim() : DisplayText.trim();
    const closeBtn = document.createElement('span');
    closeBtn.classList.add('product-filter__remove-filter');
    closeBtn.classList.add('icon__cross');
    closeBtn.classList.add('js_product-filter__remove-filter');
    closeBtn.addEventListener('click', this.handleRemoveFilter(appliedFilter));
    el.appendChild(closeBtn);
    this[`${Key}-${Value}`] = el;
    return el;
  };

  handleRemoveFilter = (filter) => () => {
    this[`${filter.Key}-${filter.Value}`].remove();
    this.setHeightAppliedFilters();
    this.uncheckedFilter(filter);
    this.displayCleanAll();
    this.handleSubmitFilter();
  };

  uncheckedFilter = (filter) => {
    const filterSelector = this.filterItemsSelector.find((filterItemSelector) => {
      const { key, text } = filterItemSelector.dataset;
      return filter.Key === key && filter.Value === text;
    });
    if (filterSelector) {
      this.unselectedFilter = true;
      this.selectedFilter = null;
      filterSelector.checked = false;
      filterSelector.classList.remove('product-filter__filter-item--active');
      if (filterSelector.dataset.link !== undefined) {
        const totalItemSelector = this.filterItemsSelector.find((filterItemSelector) => filterItemSelector.dataset.key === filter.Key && filterItemSelector.dataset.text === 'All');
        if (totalItemSelector) {
          totalItemSelector.classList.add('product-filter__filter-item--active');
        }
      }
    }
  };

  uncheckedAllFilter = () => {
    this.filterItemsSelector.forEach((filterItem) => {
      filterItem.checked = false; // eslint-disable-line no-param-reassign
      filterItem.classList.remove('product-filter__filter-item--active');
      if (filterItem.dataset.link !== undefined && filterItem.dataset.text === 'All') {
        filterItem.classList.add('product-filter__filter-item--active');
      }
    });
  };

  handleClickFilter = (selector) => () => {
    const { key, text, link, originText } = selector.dataset;
    // handle data-link
    if (link !== undefined) {
      let appliedFilter;
      if (text !== 'All') {
        appliedFilter = this.createAppliedFilters({
          Key: key,
          DisplayText: originText,
          originText,
          link: true,
          Value: text,
        });
      }

      // remove other filter links has same key
      [...this.appliedFiltersSelector.childNodes].forEach((child) => {
        if (child.dataset && child.dataset.link !== undefined && child.dataset.key === key) {
          child.remove();
        }
      });
      this.filterItemsSelector.forEach((filterItem) => {
        if (filterItem.dataset.key === key && filterItem.dataset.link !== undefined) {
          filterItem.classList.remove('product-filter__filter-item--active');
        }
      });
      selector.classList.add('product-filter__filter-item--active');
      if (appliedFilter) {
        this.appliedFiltersSelector.appendChild(appliedFilter);
      }
    } else {
      const { type } = selector;

      if (type === 'checkbox') {
        this.handleCheckbox(selector, key, text, originText);
      } else if (type === 'radio') {
        this.handleRadio(selector, key, text, originText);
      }
    }
    this.setHeightAppliedFilters();
    this.handleSubmitFilter();
    this.displayCleanAll();
    this.appliedFiltersWrapperSelector.addEventListener('transitionend', () => {
      this.productFilterBodySelector.style.height = `${this.productFilterBodyWrapperSelector.offsetHeight}px`;
    });
  };

  handleCheckbox = (selector, key, value, displayText) => {
    if (selector.checked) {
      this.selectedFilter = key;
      const appliedFilter = this.createAppliedFilters({
        Key: key,
        DisplayText: displayText,
        Value: value,
      });
      this.appliedFiltersSelector.appendChild(appliedFilter);
      this.unselectedFilter = false;
    } else {
      this[`${key}-${value}`].remove();
      this.unselectedFilter = true;
      this.selectedFilter = null;
    }
  };

  handleRadio = (selector, key, value, displayText) => {
    const { name } = selector;
    const appliedFilter = this.createAppliedFilters({
      Key: key,
      DisplayText: displayText,
      Value: value,
    });
    [...this.appliedFiltersSelector.childNodes].forEach((child) => {
      if (child.dataset && child.dataset.key === name) {
        child.remove();
      }
    });
    this.appliedFiltersSelector.appendChild(appliedFilter);
  };

  handleSubmitFilter = () => {
    const appliedFilter = this.getListAppliedFilters();
    this.onSubmit(appliedFilter, this.selectedFilter);
  };

  getListAppliedFilters = () => {
    const appliedFilter = [];
    [...this.appliedFiltersSelector.childNodes].forEach((child) => {
      if (child.dataset && !child.classList.contains('disable_unselected')) {
        const { key, text } = child.dataset;
        appliedFilter.push({
          key,
          text,
        });
      }
    });
    return appliedFilter;
  };

  updateFilter = (filterResult, allText) => {
    const listFilterInitalize = this.filterItemsSelector.filter((selector) => {
      const { key } = selector.dataset;
      return key === filterResult.FilterKey;
    });
    listFilterInitalize.forEach((filter) => {
      const filterElement = filterResult.FilterTypes.find((responeFilter) => {
        const { text } = filter.dataset;
        return text === responeFilter.OriginalText;
      });
      const closetElement = filter.closest('.product-filter__filter-item');
      if (filterResult.IsStock) {
        if (!filterElement || filterElement.Disable) {
          closetElement.classList.add('disable');
          filter.disabled = true;
        } else {
          closetElement.classList.remove('disable');
          filter.disabled = false;
        }
      } else if (filterElement) {
        closetElement.classList.add('show');
      } else {
        closetElement.classList.remove('show');
      }
    });
    this.setHeightFilterCollapse();

    setTimeout(() => {
      this.productFilterBodySelector.style.height = `${this.productFilterBodyWrapperSelector.offsetHeight}px`;
    }, 500);
  };

  IsOnlyOneSelectedKey = () => {
    const listAppliedFilter = this.getListAppliedFilters();
    if (listAppliedFilter.length > 0) {
      if (listAppliedFilter.length === 1) {
        this.currentAppliedFilter = listAppliedFilter[0].key;
        return true;
      }
      const listAppliedFilterKey = listAppliedFilter.reduce((total, currentValue) => {
        let listKey = [];
        if (Array.isArray(total)) {
          listKey = total;
        } else {
          listKey.push(total.key);
        }
        const isKeyExisted = listKey.find((e) => e === currentValue.key);
        if (!isKeyExisted) {
          listKey.push(currentValue.key);
        }
        return listKey;
      });
      if (listAppliedFilterKey.length === 1) {
        this.currentAppliedFilter = listAppliedFilterKey[0];
        return true;
      }
    }
    return false;
  };

  updateAllText = (allText) => {
    const filterSelector = this.filterItemsSelector.find((selector) => {
      const { key, text } = selector.dataset;

      return text === 'All' && key === 'Type';
    });

    filterSelector.innerText = allText;
  };

  setHeightFilterCollapse = () => {
    this.filterCollapses.forEach((collapse) => {
      if (collapse.classList.contains('show')) {
        const filterItems = collapse.querySelector('.product-filter__filter-items');
        collapse.style.height = `${filterItems.offsetHeight}px`;
      }
    });
  };

  handleCleanAllFilter = () => {
    this.selectedFilter = null;
    this.emptyDOMAppliedFilter(this.appliedFiltersSelector);
    this.setHeightAppliedFilters();
    this.uncheckedAllFilter();
    this.displayCleanAll();
    this.handleSubmitFilter();
  };

  emptyDOMAppliedFilter = (selector) => {
    [...this.appliedFiltersSelector.childNodes].forEach((element) => {
      if (!element?.classList?.contains('disable_unselected')) {
        this.appliedFiltersSelector.removeChild(element);
      }
    });
  };
}
