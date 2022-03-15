class SearchResult {
  constructor(selector) {
    this.component = selector;
    this.searchResultSelector = [...document.querySelectorAll('.js-search__result-val')];
    this.searchResultContent = [...document.querySelectorAll('.js-search-result')];
    this.formSearchSelector = this.component.querySelector('.js_hero-search__form');
    this.formSearchInputSelector = this.component.querySelector('.js_hero-search__form-input');
    this.formSearchSelector.onsubmit = (e) => {
      e.preventDefault();
      const { value } = this.formSearchInputSelector;
      if (value.trim()) {
        window.location.href = `${window.location.origin}/search?text=${value}`;
      }
    };
    this.bindingEvent();
  }

  bindingEvent = () => {
    this.searchResultSelector.forEach((e) => {
      e.addEventListener('click', () => {
        if (!e.classList.contains('active')) {
          this.searchResultSelector.forEach((g) => {
            g.classList.remove('active');
          });
          e.classList.add('active');
        }
        const dataCategory = e.getAttribute('data-category');
        this.searchResultContent.forEach((f) => {
          f.classList.remove('active');
          const dataContent = f.getAttribute('data-categorysection');
          if (dataCategory === 'all-results') {
            f.classList.remove('hide');
          } else if (dataContent === dataCategory) {
            f.classList.add('active');
            f.classList.remove('hide');
          } else {
            f.classList.add('hide');
          }
        });
      });
    });
  }
}

export default SearchResult;
