/* eslint-disable no-undef */
import Vue from 'vue';
import { validateForm } from '../../scripts/ultis/validateForm/validate-form';
import JsTabs from '../JsTabs/JsTabs';
import Modal from '../Modal/Modal';
import { getClosest, serialize, createScriptTagForGoogleApi } from '../../scripts/ultis/dom';
import { render } from '../../scripts/ultis/render';
import deliveryAddressItem from './delivery-detail-item.pug';
import billingAddressItem from './billing-detail-item.pug';
import Selectbox from '../../scripts/components/Selectbox';
import { popup } from '../Popup/Popup';
import deliveryAddressModal from './delivery-address-modal.pug';
import AccountServices from '../../services/AccountServices';
import simpleNotify from '../../scripts/ultis/simpleNotify';
import { googleMap } from '../../../sparepart/scripts/entry/config';
import CommonServices from '../../services/CommonServices';

export default class MyAccount {
  getDeliveryAddressItemTemplate() {
    return deliveryAddressItem;
  }

  getBillingAddressItemTemplate() {
    return billingAddressItem;
  }

  constructor(selector) {
    this.component = selector;
    this.editAccountBtn = this.component.querySelector('.js_myacc-form-pd__edit');
    this.deliveryDetailContent = this.component.querySelector('.js_myacc-form-dd');
    this.billingDetailContent = this.component.querySelector('.js_myacc-form-bd');
    this.savePersonalDetailBtn = this.component.querySelector('.js_personal-detail__save-btn');
    this.addCardPaymentBtns = this.component.querySelectorAll('.js_myacc-form-cpd__add');
    this.addCardPaymentTarget = this.component.querySelector('.js_add-card-payment-modal');

    this.addressModalForm = this.component.querySelector('.js_address-detail__modal-form');

    this.saveAddressModalBtn = this.component.querySelector('.js_address-detail__save-btn');
    this.addressType = {
      Delivery: 'Delivery',
      Billing: 'Billing',
    };
    this.componentForm = {
      subpremise: 'short_name',
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      sublocality_level_1: 'long_name',
      administrative_area_level_1: 'short_name',
      postal_code: 'short_name',
    };

    this.orderHistorySection = this.component.querySelector('.js_order-history');
    this.myacccontainer = this.component.querySelector('.js_myacc__container');
    this.orderHistoryDetailSection = this.component.querySelector('.js_order-history-detail');
    this.orderTabContent = this.component.querySelector('.js_order-history-tabs__content');
    this.confirmModalBtn = this.component.querySelector('.js_confirm-modal__delete-btn');
    this.inforText = this.component.querySelector('.js_myacc-detail__info-text');
    this.initTab();
    this.bindEvents();
    createScriptTagForGoogleApi();
  }

  bindEvents = () => {
    this.bindEventDeliveryDetail();
    this.bindEventBillingDetail();
    this.bindEventViewHistory();
    // this.bindDownloadInvoice();
    this.bindEventReorer();
    this.bindCardPaymentDetail();
    this.confirmModalBtn && this.confirmModalBtn.addEventListener('click', this.handleClickDeleteConfirmModal);
    this.preventEnterSubmitOnForm();
  };

  bindEventDeliveryDetail = () => {
    this.deliveryDetailContent.addEventListener('click', this.eventDeliveryDetail);
  };

  preventEnterSubmitOnForm = () => {
    [...this.component.querySelectorAll('form')].forEach((f) => {
      f.addEventListener('keypress', (e) => {
        if (e.keyCode === 13) {
          e.preventDefault();
        }
      });
    });
  };

  bindEventReorer = () => {
    this.orderHistoryDetailSection.addEventListener('click', (e) => {
      if (e.target.matches('.js_odh-form__reorder')) {
        const { dataset } = e.target;
        this.reOrder(dataset.orderId);
      }
    });
  };

  eventDeliveryDetail = (e) => {
    let { target } = e;
    if (target.matches('.js_myacc-form-dd__add')) {
      this.renderAddressModelContent(target, this.addressType.Delivery, null);
    } else if (target.matches('.js_myacc-form-dd__edit') || getClosest(target, '.js_myacc-form-dd__edit')) {
      target = target.matches('.js_myacc-form-dd__edit') ? target : getClosest(target, '.js_myacc-form-dd__edit');
      this.renderAddressModelContent(target, this.addressType.Delivery, target.dataset.deliveryId);
    } else if (target.matches('.js_myacc-form-dd__delete') || getClosest(target, '.js_myacc-form-dd__delete')) {
      target = target.matches('.js_myacc-form-dd__delete') ? target : getClosest(target, '.js_myacc-form-dd__delete');
      this.showConfirmModalDeliveryAddress(target);
    }
  };

  disableAllDeleteLink = (target, selector) => {
    [...target.querySelectorAll(selector)].forEach((link) => {
      link.classList.add('disable-click');
    });
  };

  enableAllDeleteLink = (target, selector) => {
    [...target.querySelectorAll(selector)].forEach((link) => {
      link.classList.remove('disable-click');
    });
  };

  bindEventBillingDetail = () => {
    this.billingDetailContent.addEventListener('click', this.eventBillingDetail);
  };

  eventBillingDetail = (e) => {
    let { target } = e;
    if (target.matches('.js_myacc-form-bd__add')) {
      this.renderAddressModelContent(target, this.addressType.Billing, null);
    } else if (target.matches('.js_myacc-form-bd__edit') || getClosest(target, '.js_myacc-form-bd__edit')) {
      target = target.matches('.js_myacc-form-bd__edit') ? target : getClosest(target, '.js_myacc-form-bd__edit');
      this.renderAddressModelContent(target, this.addressType.Billing, target.dataset.billingId);
    } else if (target.matches('.js_myacc-form-bd__delete') || getClosest(target, '.js_myacc-form-bd__delete')) {
      target = target.matches('.js_myacc-form-bd__delete') ? target : getClosest(target, '.js_myacc-form-bd__delete');
      this.showConfirmModalBillingAddress(target);
    }
  };

  bindEventViewHistory = () => {
    this.orderHistorySection.addEventListener('click', (e) => {
      if (e.target.matches('.js_odh-form__view-detail')) {
        const { dataset } = e.target;
        this.renderOrderDetail(dataset.orderNumber, dataset.userId);
      } else if (e.target.matches('.js_odh-form__reorder')) {
        const { dataset } = e.target;
        this.reOrder(dataset.orderId);
      }
    });
  };

  showOrderHistoryDetail = () => {
    this.orderHistoryDetailSection.classList.add('active');
    this.myacccontainer.classList.remove('active');
    this.orderTabContent.classList.add('history-detail--show');
    setTimeout(() => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 100);
  };

  hideOrderHistoryDetail = () => {
    this.myacccontainer.classList.add('active');
    this.orderHistoryDetailSection.classList.remove('active');
    this.orderTabContent.classList.remove('history-detail--show');
  };

  updateDatasetConfirmModalBtn = (addressType, rowId, userId) => {
    this.confirmModalBtn.dataset.currentType = addressType;
    this.confirmModalBtn.dataset.rowId = rowId;
    this.confirmModalBtn.dataset.userId = userId;
  };

  initTab = () => {
    const myAccTabs = new JsTabs({
      elm: '#myacc-tabs',
      shouldScrollTabIntoView: false,
    });
    myAccTabs.init();
  };

  buildEmptyDataAddress = () => ({
    companyName: '',
    primaryNumber: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    address: '',
    unit: '',
    streetNumber: '',
    streetName: '',
    suburb: '',
    state: '',
    postCode: '',
    country: '',
    defaultShipping: false,
    defaultBilling: false,
    abn: '',
  });

  renderAddressModelContent = async (target, addressType, rowId) => {
    let modalHeaderTilte = 'Add Delivery Address';
    let respone = this.buildEmptyDataAddress();
    if (addressType === this.addressType.Delivery) {
      if (rowId) {
        modalHeaderTilte = 'Edit Delivery Address';
        respone = await AccountServices.getDeliveryAddress(rowId);
      }
    } else if (rowId) {
      modalHeaderTilte = 'Edit Billing Address';
      respone = await AccountServices.getBillingAddress(rowId);
    } else {
      modalHeaderTilte = 'Add Billing Address';
    }
    if (!this.addressModal) {
      this.addressModal = new Modal(target);
    }
    if (this.addressFormModalInstance) {
      this.addressFormModalInstance.setData(respone, rowId, addressType);
    } else {
      const addressModalBody = this.component.querySelector('.js_address-detail__modal-form');
      this.addressFormModalInstance = this.createAddressFormInstance(addressModalBody, respone, addressType, rowId);
      this.addressFormModalInstance.addressModal = this.addressModal;
      this.addressFormModalInstance.componentForm = this.componentForm;
      this.addressFormModalInstance.inforText = this.inforText;
      this.addressFormModalInstance.getBillingAddressItemTemplate = this.getBillingAddressItemTemplate;
      this.addressFormModalInstance.getDeliveryAddressItemTemplate = this.getDeliveryAddressItemTemplate;
    }
    this.addressModal.updateHeaderTilte(modalHeaderTilte);
    this.addressModal.openModal();
  };

  createAddressFormInstance = (addressModalBody, dataInput, addressType, rowId) =>
    new Vue({
      props: ['addressModal', 'componentForm', 'inforText', 'getDeliveryAddressItemTemplate', 'getBillingAddressItemTemplate'],
      template: deliveryAddressModal,
      el: addressModalBody,
      data: {
        manually: false,
        addressType,
        rowId,
        dataSource: {
          ...dataInput,
        },
        defaultCountry: googleMap.componentRestrictions,
        countryName: googleMap.defaultCountry,
        error: {},
        abnValidateMessage: '',
        inValidAddress: false,
      },
      mounted() {
        this.getCountryCode();
        this.getCountryName();
        this.initValidateForAddressModalForm();
        this.initSelectBox();
        this.initGoogleLocationOnAddressModal();
      },
      methods: {
        showManuanllyAddress() {
          this.manually = !this.manually;
        },
        async handleSubmit(event) {
          event.preventDefault();
          let formData = serialize(this.$el);
          formData = { ...formData, id: this.rowId };
          let respone;
          try {
            if (this.addressType === 'Delivery') {
              if (this.rowId) {
                respone = await AccountServices.editDeliveryAddress(formData);
              } else {
                respone = await AccountServices.addNewDeliveryAddress(formData);
              }
            } else if (this.rowId) {
              respone = await AccountServices.editBillingAddress(formData);
            } else {
              respone = await AccountServices.addNewBillingAddress(formData);
            }
            if (respone.shippings.length > 0) {
              this.renderDeliveryAddressContent(respone.shippings);
            }
            if (respone.billings.length > 0) {
              this.renderBillingAddressContent(respone.billings);
            }
            this.renderInforTextWhenSave(respone.Message);
            this.closeModal();
          } catch (error) {
            this.error = error;
          }
        },
        renderDeliveryAddressContent(data) {
          const listItem = document.querySelector('.js_myacc-form-dd__list-item');
          listItem.innerHTML = '';
          data.forEach((address) => {
            const div = document.createElement('div');
            div.innerHTML = render(this.getDeliveryAddressItemTemplate(), address);
            listItem.appendChild(div.firstChild);
          });
        },
        renderBillingAddressContent(data) {
          const listItem = document.querySelector('.js_myacc-form-bd__list-item');
          listItem.innerHTML = '';
          data.forEach((address) => {
            const div = document.createElement('div');
            div.innerHTML = render(this.getBillingAddressItemTemplate(), address);
            listItem.appendChild(div.firstChild);
          });
        },
        renderInforTextWhenSave(message) {
          if (message) {
            const spanInfor = this.inforText.querySelector('span.js_infor_content');
            spanInfor.textContent = message;
            this.inforText.classList.remove('d-none');
          } else {
            this.inforText.classList.add('d-none');
          }
        },
        setData(respone, rowIdValue, addressTypeValue) {
          this.dataSource = respone;
          this.manually = false;
          this.rowId = rowIdValue;
          this.error = [];
          this.addressType = addressTypeValue;
          this.inValidAddress = false;
          if (this.dataSource.state) {
            this.addressStateSelectBox.forceSelectKey(this.dataSource.state);
          } else {
            this.addressStateSelectBox.reset();
          }
          this.clearForm();
        },
        clearForm() {
          this.form.clear();
        },
        initValidateForAddressModalForm() {
          this.form = validateForm(this.$refs.deliveryAddressModalForm);
        },
        initSelectBox() {
          this.addressStateSelectBox = new Selectbox(this.$el);
          this.addressStateSelectBox.onSubmit = this.handleSubmitCombobox;
          popup(this.$el.querySelector('.js_select-box'));
          this.bindDataForAddressState(this.addressStateSelectBox, this.dataSource.state);
        },
        bindDataForAddressState(combobox, key) {
          CommonServices.fecthStateList(this.defaultCountry.country).then((data) => {
            if (data.states && data.states.length !== 0) {
              data.states.forEach((element) => {
                combobox.addMoreOption(element.stateCode, element.stateDisplayName);
              });
            } else {
              combobox.addMoreOption('NSW', 'New South Wales');
              combobox.addMoreOption('QLD', 'Queensland');
              combobox.addMoreOption('SA', 'South Australia');
              combobox.addMoreOption('TAS', 'Tasmania');
              combobox.addMoreOption('VIC', 'Victoria');
              combobox.addMoreOption('WA', 'Western Australia');
              combobox.addMoreOption('NT', 'Northern Territory');
              combobox.addMoreOption('JBT', 'Jervis Bay Territory');
              combobox.addMoreOption('ACT', 'Australian Capital Territory');
            }
            combobox.reset();
            if (key) combobox.forceSelectKey(key);   
          });
        },
        handleSubmitCombobox(key) {
          this.dataSource.state = key;
        },
        closeModal(event) {
          if (event) event.preventDefault();
          this.addressModal.forceHideModal();
        },

        initGoogleLocationOnAddressModal() {
          this.googleMapInput = this.$el.querySelector('.js_address-modal__input-geo');
          this.innitGoogleMapAutoComplete(this.googleMapInput);
        },
        innitGoogleMapAutoComplete(target) {
          this.inputGoogleMap = new google.maps.places.Autocomplete(target, {
            types: googleMap.types,
            componentRestrictions: this.defaultCountry,
          });
          this.inputGoogleMap.setFields(['address_component']);
          this.inputGoogleMap.addListener('place_changed', this.fillInAddress);
          target.addEventListener('focusin', this.geolocate);
        },
        getCountryCode() {
          const countryCodeValue = document.querySelector('.js_country-code');
          if (countryCodeValue.value) {
            this.defaultCountry.country = countryCodeValue.value.toLowerCase();
          }
        },
        getCountryName() {
          const countryNameValue = document.querySelector('.js_country-name');
          this.countryName = countryNameValue.value;
        },
        fillInAddress() {
          this.dataSource.address = this.googleMapInput.value;
          // Get the place details from the autocomplete object.
          const place = this.inputGoogleMap.getPlace();
          if (place.address_components) {
            this.dataSource.unit = '';
            this.dataSource.suburb = '';
            // // Get each component of the address from the place details,
            // // and then fill-in the corresponding field on the form.
            const isExistSubLocal = place.address_components.find((currentAddress) => currentAddress.types[0] === 'sublocality_level_1');
            for (let i = 0; i < place.address_components.length; i += 1) {
              const addressTypeValue = place.address_components[i].types[0];
              if (this.componentForm[addressTypeValue]) {
                const val = place.address_components[i][this.componentForm[addressTypeValue]];
                if (addressTypeValue === 'administrative_area_level_1') {
                  this.addressStateSelectBox.forceSelectKey(val);
                  this.dataSource.state = val;
                } else if (addressTypeValue === 'street_number') {
                  this.dataSource.streetNumber = val;
                } else if (addressTypeValue === 'route') {
                  this.dataSource.streetName = val;
                } else if (addressTypeValue === 'sublocality_level_1') {
                  this.dataSource.suburb = val;
                } else if (addressTypeValue === 'locality' && !isExistSubLocal) {
                  this.dataSource.suburb = val;
                } else if (addressTypeValue === 'postal_code') {
                  this.dataSource.postCode = val;
                } else if (addressTypeValue === 'subpremise') {
                  this.dataSource.unit = val;
                }

                // let inputControl = document.getElementById(addressTypeValue);
                // if (inputControl) {
                //   inputControl.value = val;
                // } else {
                //   inputControl = document.querySelector(`input js_address-${addressTypeValue}`);
                //   if (inputControl) {
                //     inputControl.value = val;
                //   }
                // }
              }
              this.validateAddress(place.address_components);
            }
          }
        },
        geolocate(e) {
          const { target } = e;
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              this.updatePosition(position, target);
            });
          }
        },
        updatePosition(position, target) {
          const geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy,
          });
          this.inputGoogleMap.setBounds(circle.getBounds());
        },
        validateAddress(googleInput) {
          const streetNumber = googleInput.filter((info) => info.types[0] === 'street_number');

          if (!streetNumber || streetNumber.length === 0) {
            const streetCustomInput = this.dataSource.address.trim().split(' ');
            if (streetCustomInput.length > 1) {
              const add = streetCustomInput[0].trim();
              if (add.match(/[0-9\/\-]+/g)) {
                this.dataSource.streetNumber = add;
              }
            }
          } else {
            this.dataSource.streetNumber = streetNumber[0].long_name;
          }

          if (!this.dataSource.streetNumber || this.dataSource.streetNumber.length === 0) {
            this.inValidAddress = true;
          }
        },
      },
      computed: {
        isArrayError() {
          return Array.isArray(this.error);
        },
      },
    });

  fragmentFromString = (strHTML) => document.createRange().createContextualFragment(strHTML);

  displayErrorWhenDeleteAddressFail = (message) => {
    this.component.querySelector('.js_confirm-modal__delete-btn').disabled = true;
    this.displayErrorMessage(this.component.querySelector('.js_delete-address-detail__error'), message);
  };

  displayErrorMessage = (target, message) => {
    if (Array.isArray(message)) {
      this.renderErrorList(target, message);
    } else {
      const errorContent = `<div class="myacc-modal__error">
      <div class="myacc-modal__error-text">${message}</div>
      </div>`;
      const errorChild = this.fragmentFromString(errorContent);
      target.innerHTML = '';
      target.appendChild(errorChild);
      target.scrollIntoView();
    }
  };

  showConfirmModalDeliveryAddress = (target) => {
    const errorElements = this.component.querySelector('.js_delete-address-detail__error');
    if (errorElements) {
      errorElements.innerHTML = '';
    }
    this.component.querySelector('.js_confirm-modal__delete-btn').disabled = false;
    const { dataset } = target;
    this.handleShowDeleteConfirm(this.addressType.Delivery, dataset.deliveryId, dataset.userId, target);
  };

  showConfirmModalBillingAddress = (target) => {
    const errorElements = this.component.querySelector('.js_delete-address-detail__error');
    if (errorElements) {
      errorElements.innerHTML = '';
    }
    this.component.querySelector('.js_confirm-modal__delete-btn').disabled = false;
    const { dataset } = target;
    this.handleShowDeleteConfirm(this.addressType.Billing, dataset.billingId, dataset.userId, target);
  };

  handleShowDeleteConfirm = (addressType, rowId, userId, target) => {
    this.updateDatasetConfirmModalBtn(addressType, rowId, userId);
    if (!this.confirmDeleteModal) {
      this.confirmDeleteModal = new Modal(target);
    }
    const deletedText = target.dataset.deliveryId ? 'delivery address' : 'billing address';
    const textEl = this.component.querySelector('.js_confirm-modal-delete__text');
    textEl.innerText = deletedText;
    this.confirmDeleteModal.openModal();
  };

  handleClickDeleteConfirmModal = () => {
    const { dataset } = this.confirmModalBtn;
    if (dataset.currentType === this.addressType.Delivery) {
      this.deleteDeliveryAddress(dataset.rowId, dataset.userId);
    } else {
      this.deleteBillingAddress(dataset.rowId, dataset.userId);
    }
  };

  deleteDeliveryAddress = (deliveryId, userId) => {
    AccountServices.deleteDeliveryAddress(deliveryId, userId)
      .then(() => {
        const btnDelete = this.deliveryDetailContent.querySelector(`.js_myacc-form-dd__delete[data-delivery-id="${deliveryId}"]`);
        const wholeNode = getClosest(btnDelete, '.myacc-form__item');
        wholeNode.parentNode.removeChild(wholeNode);
        this.confirmDeleteModal.forceHideModal();
        const listItem = this.deliveryDetailContent.querySelector('.js_myacc-form-dd__list-item');
        if (this.checkElementIsEmpty(listItem)) {
          const emptyDeliveryAddress = this.fragmentFromString(
            `<span class="myacc-form__body-empty">You can save your delivery address here to make the checkout process easier. 
          <button class="btn-link myacc-form__body-link js_myacc-form-dd__add" data-modal="editAddressModal" data-user-id="">Add delivery address</button> </span>`,
          );
          listItem.appendChild(emptyDeliveryAddress);
        }
      })
      .catch((err) => {
        this.displayErrorWhenDeleteAddressFail(err);
      });
  };

  deleteBillingAddress = (billingId, userId) => {
    AccountServices.deleteBillingAddress(billingId, userId)
      .then(() => {
        const btnDelete = this.billingDetailContent.querySelector(`.js_myacc-form-bd__delete[data-billing-id="${billingId}"]`);
        const wholeNode = getClosest(btnDelete, '.myacc-form__item');
        wholeNode.parentNode.removeChild(wholeNode);
        this.confirmDeleteModal.forceHideModal();
        const listItem = this.billingDetailContent.querySelector('.js_myacc-form-bd__list-item');
        if (this.checkElementIsEmpty(listItem)) {
          const emptyBillingAddress = this.fragmentFromString(
            `<span class="myacc-form__body-empty">You can save your billing address here to make the checkout process easier.
          <button class="btn-link myacc-form__body-link js_myacc-form-bd__add" data-modal="editAddressModal" data-user-id="">Add billing address</button> </span>`,
          );
          listItem.appendChild(emptyBillingAddress);
        }
      })
      .catch((err) => {
        this.displayErrorWhenDeleteAddressFail(err);
      });
  };

  checkElementIsEmpty = (element) => element && element.innerHTML.trim().length === 0;

  renderOrderDetail = (orderNumber, userId) => {
    AccountServices.getOrderDetail(orderNumber, userId)
      .then((data) => this.renderDetail(data))
      .catch((err) => {
        console.log(err);
      });
  };

  renderDetail = (data) => {
    const detailOrderContent = this.component.querySelector('.js_odhd-form');
    detailOrderContent.innerHTML = data;

    this.showOrderHistoryDetail();
    [...this.component.querySelectorAll('.js_odhd__back')].forEach((e) => {
      e.addEventListener('click', () => {
        this.hideOrderHistoryDetail();
      });
    });
  }

  // bindDownloadInvoice = () => {
  //   this.component.querySelector('.js_order-history-tabs__content').addEventListener('click', (e) => {
  //     if (e.target.matches('.js_odh-form__download-invoice')) {
  //       window.open(e.target.dataset.link, '_blank');
  //     }
  //   });
  // };

  renderInforTextWhenSave(message) {
    const spanInfor = this.inforText.querySelector('span.js_infor_content');
    spanInfor.textContent = message;
    this.inforText.classList.remove('hidden');
  }

  createScriptTagForGoogleApi = () => {
    const googleTag = document.createElement('script');
    googleTag.src = GOOLE_MAP_API;
    googleTag.async = true;
    document.body.appendChild(googleTag);
  };

  reOrder = (orderId) => {
    AccountServices.postReOrder(orderId)
      .then((respone) => {
        const { cartPageLink, failedItems } = respone;
        if (respone.totalItems === 0) {
          simpleNotify.notify({
            message: 'No items are available for adding to cart',
            level: 'danger',
          });
        } else if (failedItems.length > 0) {
          const errorProducts = failedItems.join();
          window.location.href = `${cartPageLink}?errors=${errorProducts}`;
        } else {
          window.location.href = cartPageLink;
        }
      })
      .catch((error) => {
        simpleNotify.notify({
          message: error.Message,
          level: 'danger',
        });
      });
  };

  bindCardPaymentDetail = () => {
    this.paymentForm = document.querySelector('.js_add-payment-form');
    this.paymentSuccess = document.querySelector('.js_add-payment-success');
    [].forEach.call(this.addCardPaymentBtns, (item) => {
      this.cardPaymentModal = new Modal(item);
      item.addEventListener('click', () => {
        this.paymentForm.classList.remove('d-none');
        this.paymentSuccess.classList.add('d-none');
        this.cardPaymentModal.openModal();
      });
    });
  };
}
