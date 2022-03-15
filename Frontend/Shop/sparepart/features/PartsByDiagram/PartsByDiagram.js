import PartsByDiagramServices from './PartsByDiagramServices';
import ProductListDiagram from './ProductListByDiagram';
import { emptyDOM } from '../../../core/scripts/ultis/dom';

class PartsByDiagram {
  state = {
    products: [],
    hasMore: false,
    recommended: {},
  }

  bodyRequest = {}
  constructor(selector) {
    this.component = selector;
    this.needHelp = this.component.querySelector('.js_parts-by-diagram__need-help');
    this.diagramFilterBtn = [...this.component.querySelectorAll('.js_parts-by-diagram__filter-btn')];
    this.input = this.component.querySelector('.js_diagram__search-input');
    this.diagramCode = this.component.querySelector('.js_parts-by-diagram').getAttribute('diagram-code');
    this.diagramSearchResult = this.component.querySelector('.js_diagram-auto-complete');
    this.productList = new ProductListDiagram(this.component, 1);
    this.initEvent();
    this.initData();
  }

  initEvent = () => {
    this.needHelp.addEventListener('click', this.handleClick);
    this.diagramFilterBtn.forEach((e) => {
      e.addEventListener('click', () => this.handleClickBtn(e));
    });
    this.input.addEventListener('focus', this.handleFocusInput);
    this.input.addEventListener('input', this.handleChangeInput);
    this.input.addEventListener('blur', this.handleOutFocusInput);
  }

  initData = () => {
    this.bodyRequest = { productCode: this.diagramCode };
    this.selectedValue = this.getDiagramBtnActive().dataset.value;
  }

  getDiagramBtnActive = () => this.diagramFilterBtn.filter(btn => btn.classList.contains('active'))[0];


  handleClick = (e) => {
    e.preventDefault();
    this.needHelp.parentNode.classList.toggle('active');
  }
  handleClickBtn = (e) => {
    const currentBtnActive = this.getDiagramBtnActive();
    currentBtnActive.classList.toggle('active');
    e.classList.toggle('active');
    const selectedValue = e.dataset.value;
    this.updateBodyRequest({ selectedValue, diagramCode: null });
    this.getPartList();
    this.input.value = "";
  }
  handleFocusInput = () => {
    let key = this.input.value;
    if (key.length > 0) {
      this.diagramSearchResult.style.display = "block";
    }
  }
  handleChangeInput = () => {
    let key = this.input.value;
    let icon = this.component.querySelector('.js_diagram__search-icon');
    if (key.length > 0) {
      icon.classList.remove('icon-search');
      icon.classList.add('icon-close-icon');
      this.fetchData(key);
    } else {
      icon.classList.add('icon-search');
      icon.classList.remove('icon-close-icon');
    }
    icon.addEventListener('click', () => {
      this.input.value = "";
      this.updateBodyRequest({ diagramCode: null });
      this.getPartList();
    });
  }
  handleOutFocusInput = () => {
    setTimeout(() => {
      this.diagramSearchResult.style.display = "";
    }, 300);
  }
  selectItem = (e) => {
    this.itemSelect = [...document.querySelectorAll('.diagram-auto-complate__item')];
    this.itemSelect.forEach((e) => {
      e.addEventListener('click', (x) => {
        const diagramCode = e.dataset.diagramCode;
        this.updateBodyRequest({ diagramCode });
        this.getPartList();
        let txt = e.innerText;
        this.input.value = txt;
      });
    });
  }
  fetchData = (key) => {
    PartsByDiagramServices.fetchDiagramList(this.bodyRequest.productCode, key).then((data) => {
      this.diagramSearchResult.style.display = "block";
      this.renderData(data.diagram);
      this.selectItem();
    }).catch((err) => {
      if (err === 'cancel') {
        return;
      }
    });
  }
  renderData = (data) => {
    emptyDOM(this.diagramSearchResult);
    if (data.length === 0) {
      this.diagramSearchResult.innerText = 'Not part found in diagram';
    } else {
      let html = '';
      data.forEach((item) => {
        let code = item.code;
        let name = item.Name;
        html += '<div class="diagram-auto-complate__item">'
          + '<span>' + code + ' - </span>'
          + '<span>' + name + '</span>'
          + '</div>';
      });
      this.diagramSearchResult.insertAdjacentHTML('beforeend', html);
    }
  }

  updateBodyRequest = (data) => {
    this.bodyRequest = {
      ...this.bodyRequest,
      ...data
    };
  }

  render = () => {
    this.productList.props = {
      recommended: this.state.recommended,
      hasMore: this.state.hasMore,
      page: this.state.page,
      bodyRequest: this.bodyRequest,
    };
    this.productList.render(false, this.state.products);
  }
  setState = (data) => {
    this.state = {
      ...this.state,
      ...data,
    };
    this.render();
  }

  getPartList = () => {
    this.productList.showLoading();
    PartsByDiagramServices.fetchPartList(this.bodyRequest).then((res) => {
      this.setState({
        products: res.Products,
        recommended: {
          HighlightTitle: res.HighlightTitle,
          HighlightDescription: res.HighlightDescription,
        },
        hasMore: res.Paggination.HasMore,
        totalItem: res.Paggination.TotalItem,
        page: 1,
      });
      this.productList.hideLoading();
    }).catch((err) => {
      console.log(err, 'err');
      if (err !== 'cancel') {
        this.productList.hideLoading();
      }
    }).finally(() => {
      this.productList.hideLoading();
    });
  }


  initProductListData = () => {
    if (this.selectedValue) {
      this.updateBodyRequest(this.selectedValue);
      this.getPartList();
    }
  }

}

export default PartsByDiagram;
