import Vue from 'vue';
import Modal from '../Modal/Modal';
import template from './where-to-buy-temp.pug';
import modalTemp from './where-to-buy-modal-temp.pug';
import { emptyDOM } from '../../scripts/ultis/dom';
import WhereToBuyServices from '../../services/WhereToBuyService';

class WhereToBuyBtn {
  constructor(selector) {
    this.selector = selector;
    this.selector.addEventListener('click', this.handleClick);
    this.createModal();
  }

  handleClick = ({ target }) => {
    const { parentNode } = target;
    this.btn = parentNode?.dataset?.whereToBuy !== undefined ? parentNode : target;
    if (this.btn.dataset.whereToBuy !== undefined) {
      const { productCode } = this.btn.dataset;
      this.btn.dataset.modal = 'whereToBuyModal';
      this.modalInstance = new Modal(this.btn);
      emptyDOM(this.modalInstance.getModalBodyEl());
      const el = document.createElement('div');
      this.modalInstance.updateHeaderTilte(this.btn.dataset.title);
      this.modalInstance.getModalBodyEl().appendChild(el);
      this.modalInstance.openModal();
      this.vueInstance = this.createVueInstance(productCode, el);
      this.vueInstance.$on('hideModal', () => {
        this.modalInstance.hideModal();
      });
    }
  };

  createModal = () => {
    const modalInstance = document.body.querySelector('#whereToBuyModal');
    if (modalInstance) { return; }
    const el = document.createElement('div');
    el.innerHTML = modalTemp;
    document.body.appendChild(el.childNodes[0]);
  }

  createVueInstance = (partNumber, el) =>
    new Vue({
      template,
      el,
      data: () => ({
        loading: false,
        title: '',
        btnText: '',
        stores: [],
      }),

      created() {
        this.fetchData();
      },

      methods: {
        async fetchData() {
          this.loading = true;
          try {
            const { title, btnText, stores } = await WhereToBuyServices.getData(partNumber);
            this.title = title;
            this.btnText = btnText;
            this.stores = stores;
            this.loading = false;
          } catch (err) {
            this.loading = false;
          }
        },
      },
    });
}

export default WhereToBuyBtn;

export const whereToBuyBtn = (selector) => new WhereToBuyBtn(selector);
