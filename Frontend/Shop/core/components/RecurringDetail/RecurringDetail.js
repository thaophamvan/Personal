import Vue from 'vue';
import template from './recurring-detail.pug';
import RecurringServices from '../../services/RecurringServices';
import lazyloadImg from '../../scripts/ultis/lazyloadImg';
import Modal from '../Modal/Modal';
import simpleNotify from '../../scripts/ultis/simpleNotify';

export default class RecurringDetail {
  constructor(selector) {
    this.selector = selector;
    this.vueInstance = new Vue({
      el: '.js_recurring-detail-content',
      template,
      data: () => ({
        loadedPage: false,
        loadingPage: false,
        loadingData: false,
        cartName: window.location.search.split('=')[1],
        isMobile: window.innerWidth < 992,
        oriRes: {},
        OrderDetail: {},
        ListRecurringPlan: [],
        SelectedRecurringPlanInformation: {},
        products: [],
        isEditing: false,
        cancelOrderModal: false,
        deletingProduct: {},
        deleteProductModal: false,
        hasChanged: false,
        isEnableRecurring: true,
      }),

      created() {
        this.fetchData();
        document.addEventListener('click', (event) => {
          const { target } = event;
          if (target.classList.contains('js_pdp-select-recurring__btn')) {
            return;
          }
          this.closeAllPopup();
        });
      },

      methods: {
        async fetchData() {
          this.loadingPage = true;
          try {
            const response = await RecurringServices.getPlan(this.cartName);
            this.oriRes = response;
            this.setData(response);
          } catch (err) {
            simpleNotify.notify({
              message: err?.Message,
              level: 'danger',
            });
          }
          this.loadedPage = true;
          this.loadingPage = false;
        },

        setData(response) {
          const { OrderDetail, ListRecurringPlan, SelectedRecurringPlanInformation, isEnableRecurring } = response;
          this.OrderDetail = OrderDetail;
          this.ListRecurringPlan = ListRecurringPlan;
          this.SelectedRecurringPlanInformation = SelectedRecurringPlanInformation;
          this.products = OrderDetail.products;
          this.isEnableRecurring = isEnableRecurring;
          setTimeout(() => lazyloadImg.DoObserver(), 0);
        },

        async increaseProduct(product) {
          if (this.loadingData) {
            return;
          }
          this.loadingData = true;
          try {
            const response = await RecurringServices.changePlan(this.cartName, product.VariantCode, product.quantity + 1);
            this.setData(response);
          } catch (err) {
            simpleNotify.notify({
              message: err?.Message,
              level: 'danger',
            });
          }
          this.hasChanged = true;
          this.loadingData = false;
        },

        async decreaseProduct(product) {
          if (this.loadingData) {
            return;
          }
          if (product.quantity === 1) {
            return;
          }
          this.loadingData = true;
          try {
            const response = await RecurringServices.changePlan(this.cartName, product.VariantCode, product.quantity - 1);
            this.setData(response);
          } catch (err) {
            simpleNotify.notify({
              message: err?.Message,
              level: 'danger',
            });
          }
          this.hasChanged = true;
          this.loadingData = false;
        },

        async removeProduct() {
          if (this.loadingData) {
            return;
          }
          if (this.products.length === 1) {
            this.hideDeleteProduct();
            this.cancelOrder();
            return;
          }
          this.loadingData = true;
          try {
            const response = await RecurringServices.changePlan(this.cartName, this.deletingProduct.VariantCode, 0);
            this.setData(response);
          } catch (err) {
            simpleNotify.notify({
              message: err?.Message,
              level: 'danger',
            });
          }
          this.hasChanged = true;
          this.loadingData = false;
        },

        redirect(path) {
          window.location.href = path;
        },

        closeAllPopup() {
          const recurringPopupElements = document.querySelectorAll('.js_recurring-popup');
          [].forEach.call(recurringPopupElements, (item) => {
            item.classList.remove('is-active');
            item.querySelector('.popup').classList.remove('show');
          });
        },

        showPopup(event) {
          const { currentTarget } = event;
          this.closeAllPopup();
          currentTarget.classList.add('is-active');
          currentTarget.querySelector('.popup').classList.add('show');
        },

        async onChangeRecurring(recurring) {
          if (this.loadingData) {
            return;
          }
          this.loadingData = true;
          try {
            const response = await RecurringServices.changePlan(this.cartName, '', 0, recurring.recurringPlanId);
            this.setData(response);
          } catch (err) {
            simpleNotify.notify({
              message: err?.Message,
              level: 'danger',
            });
          }
          this.hasChanged = true;
          this.loadingData = false;
        },
        async editOrder(isEditing) {
          if (this.loadingData) {
            return;
          }
          this.loadingData = true;
          if (isEditing) {
            try {
              await RecurringServices.editPlan(this.cartName);
            } catch (err) {
              simpleNotify.notify({
                message: err?.Message,
                level: 'danger',
              });
              return;
            }
          } else {
            RecurringServices.cancelEditPlan(this.cartName);
            this.setData(this.oriRes);
          }
          this.loadingData = false;
          this.isEditing = !!isEditing;
        },
        showCancelOrder(event) {
          if (!this.cancelOrderModal) {
            this.cancelOrderModal = new Modal(event.target);
          }
          this.cancelOrderModal.openModal();
        },
        hideCancelOrder() {
          if (this.cancelOrderModal) {
            this.cancelOrderModal.forceHideModal();
          }
        },
        async applyChange() {
          if (this.loadingData) {
            return;
          }
          this.loadingData = true;
          try {
            await RecurringServices.applyPlan(this.cartName);
          } catch (err) {
            simpleNotify.notify({
              message: err?.Message,
              level: 'danger',
            });
            this.setData(this.oriRes);
          }
          this.loadingData = false;
          this.isEditing = false;
        },
        async cancelOrder() {
          this.hideCancelOrder();
          this.hideDeleteProduct();
          this.loadingData = true;
          try {
            await RecurringServices.cancelPlan(this.cartName);
            simpleNotify.notify({
              message: 'Your recurring order has been canceled successfully!',
              level: 'good',
            });
            this.backToOrders();
          } catch (err) {
            simpleNotify.notify({
              message: err?.Message,
              level: 'danger',
            });
          }
          this.loadingData = false;
          this.isEditing = false;
        },
        backToOrders() {
          const backElement = document.querySelector('.js_back-to-recurring-orders');
          window.location.href = backElement ? backElement.getAttribute('href') : '/';
        },
        showDeleteProduct(event) {
          const { target } = event;
          const product = this.products.find((i) => i.VariantCode === target.dataset.variantCode);
          if (!product) {
            simpleNotify.notify({
              message: 'Can not remove this product',
              level: 'danger',
            });
            console.log('can not find item', event);
            return;
          }
          this.deletingProduct = product;
          if (this.products.length > 1) {
            this.removeProduct();
            return;
          }
          if (!this.deleteProductModal) {
            this.deleteProductModal = new Modal(target);
          }
          this.deleteProductModal.openModal();
        },
        hideDeleteProduct() {
          if (this.deleteProductModal) {
            this.deleteProductModal.forceHideModal();
          }
        },
      },
    });
  }
}
