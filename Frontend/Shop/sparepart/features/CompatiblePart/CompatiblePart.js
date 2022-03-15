import JsTabs from '../../../core/components/JsTabs/JsTabs';
import AddToCartButton from '../../../core/components/AddToCartButton/AddToCart';
export default class CompatiblePart {
  constructor(element) {
    this.selector = element;
    this.allTabs = [...this.selector.querySelectorAll(".js_compatible-product-tab")];
    this.allTabsJs = [];
    this.initTab();
    this.bindEventAddToCart();
  }
  initTab = () => {
    this.allTabs.forEach((tabElm, i) => {
      const jsTabs = new JsTabs({
        elm: tabElm,
        shouldScrollTabIntoView: false,
        onClick: () => {
          this.allTabsJs.forEach((tabJs, j) => {
            if (i == j) {
              return;
            }

            tabJs.setInactiveMode();
          });
        },
        enableToggle: true,
        onToggleTab: () => {
          this.allTabsJs.forEach(tabJs => {
            tabJs.setNormalModeTab();
          });
        },
        onToggleContent: () => {
          this.allTabsJs.forEach(tabJs => {
            tabJs.setNormalModeContent();
          });
        }
      });

      jsTabs.init();

      this.allTabsJs.push(jsTabs);
    });
  }

  bindEventAddToCart = () => new AddToCartButton(this.selector);
}
