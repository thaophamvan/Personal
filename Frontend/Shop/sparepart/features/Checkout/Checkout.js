/* eslint-disable no-undef */
import Vue from "vue";
import { getClosest, createScriptTagForGoogleApi } from "../../../core/scripts/ultis/dom";
import newAddressTemplate from "./address/new-address.pug";
import billingAddressTemplate from "./address/billing-address.pug";
import { validateForm } from "../../../core/scripts/ultis/validateForm/validate-form";
import { popup } from "../../../core/components/Popup/Popup";
import Selectbox from "../../../core/scripts/components/Selectbox";
import CheckoutServices from "../../../core/services/CheckoutServices";
import CommonServices from "../../../core/services/CommonServices";
import { googleMap } from "../../scripts/entry/config";

export default class Checkout {
  constructor(element) {
    this.selector = element;
    this.addressForm = this.selector.querySelector(".js_address-form");
    this.shippingAddressDetailSection = this.selector.querySelector(".js_shipping-address-detail-form");
    this.billingAddressDetailSection = this.selector.querySelector(".js_billing-address-detail-form");
    this.shippingAddressListSection = this.selector.querySelector(".js_shipping-address-list");
    this.billingAddressListSection = this.selector.querySelector(".js_billing-address-list");
    this.addNewShippingAddressLink = this.selector.querySelector(".js_add-address-shipping");
    this.addNewBillingAddressLink = this.selector.querySelector(".js_add-address-billing");
    this.useDifferentBillingAddressRadio = this.selector.querySelector(".js_use-different-billing-address");
    this.saveDetaultDeliveryAddress = this.selector.querySelector(".js_delivery__radio-input");
    this.addressSelector = this.selector.querySelector(".js_address-selector");
    this.billingSelector = this.selector.querySelector(".js_billing-selector");
    this.shippingWarning = this.selector.querySelector(".js_shipping-head-warning__content");
    this.billingWarning = this.selector.querySelector(".js_billing-head-warning__content");

    if (window.OrderMetaData) {
      this.OrderData = {
        deliverySuburb: window.OrderMetaData?.DeliverySuburb,
        deliveryCode: window.OrderMetaData?.DeliveryPostCode,
        deliveryState: window.OrderMetaData?.DeliveryState,
      };
    }

    this.paymentSelectCreaditcartSelector = this.selector.querySelector(".js_payments-option-creditcart");

    this.paymentSelectCreaditcartSelector = this.selector.querySelector(".js_payments-option-paypal");

    this.useshippingaddressforbillingSelector = this.selector.querySelector(".js_hiden_useshippingaddressforbilling");

    this.componentForm = {
      subpremise: "short_name",
      street_number: "short_name",
      route: "long_name",
      locality: "long_name",
      sublocality_level_1: "long_name",
      administrative_area_level_1: "short_name",
      postal_code: "short_name",
    };
    this.addressType = {
      billing: "billing",
      shipping: "shipping",
    };
    if (this.billingAddressDetailSection) {
      this.isEmptyBillingAddress = this.billingAddressDetailSection.dataset.isEmptyAddress;
    }
    this.init();
  }

  init = () => {
    if (this.addressSelector) {
      this.bindAddressSelectorEvent(this.addressSelector, this.shippingWarning);
    }

    if (this.billingSelector) {
      this.bindAddressSelectorEvent(this.billingSelector, this.billingWarning);
    }
    this.getCountryCode();
    this.getCountryName();
    this.bindAddNewShippingAddressEvent();
    this.bindUseDifferentBillingAddressEvent();
    this.bindSaveDetaultDeliveryAddressEvent();
    this.validForm();
    this.bindAddNewBillingAddressEvent();
    this.bindEventSwitchPaymentMethodEvent();
    this.checkSubmit();
    createScriptTagForGoogleApi(this.initGoogleLocationSuggestionForShipping);
    this.bindAddManuallyAddress();
    this.initSelectStateComboboxForWholeForm();
  };

  getCountryCode = () => {
    const countryCodeValue = document.querySelector(".js_country-code");
    if (countryCodeValue.value) {
      this.countryCode = countryCodeValue.value.toLowerCase();
    }
  };

  getCountryName = () => {
    const countryNameValue = document.querySelector(".js_country-name");
    this.countryName = countryNameValue.value;
  };

  bindAddManuallyAddress = () => {
    if (this.shippingAddressDetailSection) {
      this.shippingAddressDetailSection.addEventListener("click", (e) => {
        if (e.target.matches(".js_manuallyAddress")) {
          [...this.shippingAddressDetailSection.querySelectorAll(".js_manuallyAddress-content")].forEach((dv) => {
            if (dv.classList.contains("hidden")) {
              this.manuallyShipping = true;
            } else this.manuallyShipping = false;
            dv.classList.toggle("hidden");
          });
        }
      });
    }
    if (this.billingAddressDetailSection) {
      this.billingAddressDetailSection.addEventListener("click", (e) => {
        if (e.target.matches(".js_manuallyAddress")) {
          [...this.billingAddressDetailSection.querySelectorAll(".js_manuallyAddress-content")].forEach((dv) => {
            if (dv.classList.contains("hidden")) {
              this.manuallyBilling = true;
            } else this.manuallyBilling = false;
            dv.classList.toggle("hidden");
          });
        }
      });
    }
  };

  validForm = () => {
    const fromElement = this.selector.querySelectorAll("input, select");
    [...fromElement].forEach((inputForm) => {
      validateForm(inputForm);
    });
  };

  bindAddressSelectorEvent = (parent, warning) => {
    parent.addEventListener("change", (e) => {
      if (e.target.matches('input[type="radio"]')) {
        [...parent.querySelectorAll(".info-item")].forEach((elm) => {
          if (elm.querySelector(".select-form")) {
            elm.querySelector(".select-form").remove();
          }
        });
        const currentSelected = parent.querySelector(".selected");
        if (currentSelected) {
          currentSelected.classList.remove("selected");
        }
        if (e.target.checked) {
          this.changeErrorStyleForShippingMessage(warning, false);
        }
        // const el = document.createElement('div');
        if (window.OrderMetaData) {
          if (window.OrderMetaData.PrimaryNumber) {
            pn = window.OrderMetaData.PrimaryNumber;
          }

          if (window.OrderMetaData.EmailAddress) {
            email = window.OrderMetaData.EmailAddress;
          }

          if (window.OrderMetaData.DeliveryInstructions) {
            instruction = window.OrderMetaData.DeliveryInstructions;
          }
        }

        const closetSelector = getClosest(e.target, ".checkout-page__address-info");
        closetSelector.classList.add("selected");
        this.validForm();
      }
    });
  };

  bindAddNewShippingAddressEvent = () => {
    if (this.addNewShippingAddressLink) {
      this.addNewShippingAddressLink.addEventListener("click", () => {
        this.addressSelector = null;
        this.newAddressShippingVueInstance = new Vue({
          el: ".js-delivery-address",
          template: newAddressTemplate,
          data() {
            return {
              countryName: "Australia",
            };
          },
          mounted: () => {
            this.validForm();
            this.initGoogleLocationSuggestionForShipping();
            this.bindSaveDetaultDeliveryAddressEvent();
            this.initShippingSelectState(this.shippingAddressDetailSection);
          },
        });
        this.newAddressShippingVueInstance.countryName = this.countryName;
      });
    }
  };

  bindAddNewBillingAddressEvent = () => {
    if (this.addNewBillingAddressLink) {
      this.addNewBillingAddressLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.isAddNewBillingAddress = true;
        this.renderAddBillingAddressForm();
      });
    }
  };

  renderAddBillingAddressForm = () => {
    this.newAddressBillingVueInstance = new Vue({
      el: ".js-billing-address",
      template: billingAddressTemplate,
      data() {
        return {
          countryName: "Australia",
        };
      },
      mounted: () => {
        this.validForm();
        this.initGoogleLocationSuggestionForBilling();
        this.bindSaveDetaultBillingAddressEvent();
        this.initBillingSelectState(this.billingAddressDetailSection);
      },
    });
    this.billingSelector = null;
    this.newAddressBillingVueInstance.countryName = this.countryName;
  };

  bindUseDifferentBillingAddressEvent = () => {
    if (this.useDifferentBillingAddressRadio) {
      this.useDifferentBillingAddressRadio.addEventListener("change", (e) => {
        if (this.useDifferentBillingAddressRadio.checked) {
          this.billingAddressDetailSection.classList.remove("hidden");
          this.useshippingaddressforbillingSelector.value = "false";
          if (this.checkIsRenderBillingForm()) {
            this.renderAddBillingAddressForm();
          }
        } else {
          this.billingAddressDetailSection.classList.add("hidden");
          this.useshippingaddressforbillingSelector.value = "true";
          if (this.checkIsRenderBillingForm()) {
            const defaultElm = this.billingAddressDetailSection.querySelector(".js-billing-address");
            defaultElm.innerHTML = "";
          }
        }
      });
    }
  };

  checkIsRenderBillingForm = () => {
    const isEmptyAddress = this.isEmptyBillingAddress === "1";
    if (this.isAddNewBillingAddress) {
      return true;
    }
    return isEmptyAddress;
  };

  bindSaveDetaultDeliveryAddressEvent = () => {
    if (this.shippingAddressDetailSection) {
      this.saveDetaultDeliveryAddress = this.shippingAddressDetailSection.querySelector(".js_delivery__radio-input");
      this.saveDefaultDeliveryAddressSelector = this.shippingAddressDetailSection.querySelector(
        ".js_hiden_savedefault_deliveryaddress"
      );
      if (this.saveDetaultDeliveryAddress) {
        this.saveDetaultDeliveryAddress.addEventListener("change", (e) => {
          if (this.saveDetaultDeliveryAddress.checked) {
            this.saveDefaultDeliveryAddressSelector.value = "true";
          } else {
            this.saveDefaultDeliveryAddressSelector.value = "false";
          }
        });
      }
    }
  };

  bindSaveDetaultBillingAddressEvent = () => {
    this.saveDetaultBillingAddress = this.billingAddressDetailSection.querySelector(".js_billing__radio-input");
    this.saveDefaultBillingAddressSelector = this.billingAddressDetailSection.querySelector(
      ".js_hiden_savedefault_billingaddress"
    );
    if (this.saveDetaultBillingAddress) {
      this.saveDetaultBillingAddress.addEventListener("change", (e) => {
        if (this.saveDetaultBillingAddress.checked) {
          this.saveDefaultBillingAddressSelector.value = "true";
        } else {
          this.saveDefaultBillingAddressSelector.value = "false";
        }
      });
    }
  };

  bindEventSwitchPaymentMethodEvent = () => {
    const options = [...document.querySelectorAll(".payments__option")];

    options.forEach((e) => {
      const self = this;
      e.addEventListener("click", (arg) => {
        if (!e.classList.contains("selected")) {
          options.forEach((el) => el.classList.remove("selected"));
          e.classList.add("selected");
          self.setPaymentMethod(e);
        }
      });
    });

    const currectSelectedPaymentMethodSelection = document.querySelector(".payments__option.selected");
    if (currectSelectedPaymentMethodSelection) {
      this.setPaymentMethod(currectSelectedPaymentMethodSelection);
    }
  };

  setPaymentMethod = (e) => {
    const url = document.querySelector(".row.payments").getAttribute("data-url");
    const paymentMethodId = e.getAttribute("data-payment-method-id");
    document.querySelector(".jsPaymentMethod").classList.add("d-none");
    document.querySelector(".jsLoadingPaymentMethod").classList.remove("d-none");
    CheckoutServices.getPaymentMethod(url, paymentMethodId)
      .then((data) => {
        document.querySelector(".jsPaymentMethod").innerHTML = data;

        const iframe = document.querySelector("#payment-frame");
        if (iframe) {
          const token = iframe.getAttribute("token");
          const checkout = new Bambora.InlineCheckout(token);
          checkout.mount(iframe);

          checkout.on(Bambora.Event.Authorize, (payload) => {
            const { acceptUrl } = payload;
            // TODO: neeed to remove this line before deploy to DXC
            // url = url.replace("https://episrv-test.Personal.se/api/IPPaymentAcceptApi/accept", "https://elux.aucommerce.local/checkout/ippaymentcallback");

            // Redirect to success link
            window.location.href = acceptUrl;
          });
        } else {
          this.handlePayPalPayment();
        }
      })
      .catch((err) => {})
      .finally(() => {
        document.querySelector(".jsPaymentMethod").classList.remove("d-none");
        document.querySelector(".jsLoadingPaymentMethod").classList.add("d-none");
      });
  };

  handlePayPalPayment = () => {
    const termAndConditionCheckBox = this.selector.querySelector(".js_payments__term-and-condition-checkbox");
    if (termAndConditionCheckBox) {
      const paymentBtn = this.selector.querySelector(".js_payments__paypal-btn");
      termAndConditionCheckBox.onclick = () => {
        const { checked } = termAndConditionCheckBox;
        if (checked) {
          paymentBtn.classList.remove("disabled");
        } else {
          paymentBtn.classList.add("disabled");
        }
      };
    }
  };

  initSelectStateComboboxForWholeForm = () => {
    const isExistShippingSelectBox = this.selector.querySelector(".js_shipping-state__select");
    if (isExistShippingSelectBox) {
      this.initShippingSelectState(this.shippingAddressDetailSection);
    }
    const isExistBillingSelectBox = this.selector.querySelector(".js_billing-state__select");
    if (isExistBillingSelectBox) {
      this.initBillingSelectState(this.billingAddressDetailSection);
    }
  };

  bindDataForAddressState = (combobox) => {
    CommonServices.fecthStateList(this.countryCode).then((data) => {
      if (data.states && data.states.length !== 0) {
        data.states.forEach((element) => {
          combobox.addMoreOption(element.stateCode, element.stateDisplayName);
        });
      } else {
        combobox.addMoreOption("NSW", "New South Wales");
        combobox.addMoreOption("QLD", "Queensland");
        combobox.addMoreOption("SA", "South Australia");
        combobox.addMoreOption("TAS", "Tasmania");
        combobox.addMoreOption("VIC", "Victoria");
        combobox.addMoreOption("WA", "Western Australia");
        combobox.addMoreOption("NT", "Northern Territory");
        combobox.addMoreOption("JBT", "Jervis Bay Territory");
        combobox.addMoreOption("ACT", "Australian Capital Territory");
      }
      combobox.reset();
    });
  };

  initShippingSelectState = (target) => {
    this.shippingAddressStateSelectBox = new Selectbox(target);
    popup(target.querySelector(".js_select-box"));
    this.shippingAddressStateSelectBox.onSubmit = this.handleSubmitShippingState;
    this.bindDataForAddressState(this.shippingAddressStateSelectBox);
  };

  handleSubmitShippingState = (key) => {
    document.getElementById("shipping_administrative_area_level_1").value = key;
  };

  initBillingSelectState = (target) => {
    this.billingAddressStateSelectBox = new Selectbox(target);
    popup(target.querySelector(".js_select-box"));
    this.billingAddressStateSelectBox.onSubmit = this.handleSubmitBillingState;
    this.bindDataForAddressState(this.billingAddressStateSelectBox);
  };

  handleSubmitBillingState = (key) => {
    document.getElementById("billing_administrative_area_level_1").value = key;
  };

  validateSelectShippingAddress = () => {
    if (this.addressSelector) {
      const listSelectAddress = [...this.addressSelector.querySelectorAll('input[type="radio"].js_pick-address')];
      for (let index = 0; index < listSelectAddress.length; index++) {
        const element = listSelectAddress[index];
        if (element.checked) {
          return true;
        }
      }
      this.changeErrorStyleForShippingMessage(this.shippingWarning, true);
      return false;
    }
    return true;
  };

  validateSelectBillingAddress = () => {
    if (this.useDifferentBillingAddressRadio.checked && this.billingSelector) {
      const listSelectAddress = [...this.billingSelector.querySelectorAll('input[type="radio"].js_pick-address')];
      if (listSelectAddress.length === 0) {
        this.selector.querySelector(".js_error-billing-address").classList.remove("hidden");
      }
      for (let index = 0; index < listSelectAddress.length; index++) {
        const element = listSelectAddress[index];
        if (element.checked) {
          return true;
        }
      }
      this.changeErrorStyleForShippingMessage(this.billingWarning, true);
      return false;
    }
    return true;
  };

  changeErrorStyleForShippingMessage = (element, isError) => {
    if (element) {
      if (isError) {
        element.classList.add("error");
      } else element.classList.remove("error");
    }
  };

  checkSubmit = () => {
    if (this.selector) {
      [...this.selector.querySelectorAll("form")].forEach((f) => {
        f.addEventListener("keypress", (e) => {
          if (e.keyCode === 13) {
            e.preventDefault();
          }
        });
      });
      if (this.selector.querySelector(".js_submit-form")) {
        this.selector.querySelector(".js_submit-form").addEventListener("click", (e) => {
          e.preventDefault();
          const form = this.selector.querySelector("form.form");
          const validateAddressSelectShipping = this.validateSelectShippingAddress();
          const validateAddressSelectBilling = this.validateSelectBillingAddress();
          const validateAddressInputShipping = this.validateAddressShippingInput();
          const validateAddressInputBilling = this.validateAddressBillingInput();
          const validateBillingState = this.validateSelectBoxBilling();
          const validateShippingState = this.validateSelectBoxShipping();
          const validAddress = this.checkValidAddress();
          this.validateSuburbAddressBilling(e.target);
          this.validateSuburbAddressShipping(e.target);
          const formValid = form.reportValidity ? form.reportValidity() : form.checkValidity();
          if (
            formValid &&
            validateAddressSelectShipping &&
            validateAddressSelectBilling &&
            validateBillingState &&
            validateShippingState &&
            validateAddressInputShipping &&
            validateAddressInputBilling &&
            validAddress
          ) {
            form.submit();
          }
        });
      }
    }
  };

  checkValidAddress = () => {
    if (
      (this.invalidateAddressBilling && !this.manuallyBilling) ||
      (this.invalidateAddressShipping && !this.manuallyShipping)
    ) {
      return false;
    }
    return true;
  };

  // ----------------------------------Google API--------------------------------------------

  bindValidateAddress = (data, section, type) => {
    let street;

    const target = section.querySelector(".js_address-suggestion");
    const streetName = data.filter((info) => info.types[0] === "street_number");

    if (!streetName || streetName.length === 0) {
      const a = target.value.trim().split(" ");
      if (a.length > 1) {
        const add = a[0].trim();
        if (add.match(/[0-9\/\-]+/g)) {
          street = {
            value: add,
            type: "street_number",
          };
        }
      }
    } else {
      street = {
        value: streetName[0].long_name,
        type: "street_number",
      };
    }

    if (!street || street.length === 0) {
      const errorMess = this.fragmentFromString(
        "<div class='validation-error'>Sorry your address is not recognizable by Google API, please enter it manually</div>"
      );
      target.parentNode.insertBefore(errorMess, target.nextSibling);
      if (type === this.addressType.billing) {
        this.invalidateAddressBilling = true;
      } else {
        this.invalidateAddressShipping = true;
      }
    } else {
      if (type === this.addressType.billing) {
        this.invalidateAddressBilling = false;
      } else {
        this.invalidateAddressShipping = false;
      }
      return street;
    }
  };

  initGoogleLocationSuggestionForShipping = () => {
    if (this.shippingAddressDetailSection) {
      const googleMapInput = this.shippingAddressDetailSection.querySelector(".js_address-suggestion");
      if (googleMapInput) {
        googleMapInput.addEventListener("keypress", () => {
          this.enteredDeliveryAddress = false;
        });
        this.initGooglePlacesAutocompleteForShipping(googleMapInput, this.fillInAddressShipping);
      }
    }
  };

  initGoogleLocationSuggestionForBilling = () => {
    if (this.billingAddressDetailSection) {
      const googleMapInput = this.billingAddressDetailSection.querySelector(".js_address-suggestion");
      if (googleMapInput) {
        googleMapInput.addEventListener("keypress", () => {
          this.enteredBillingAddress = false;
        });
        this.initGooglePlacesAutocompleteForBilling(googleMapInput, this.fillInAddressBilling);
      }
    }
  };

  initGooglePlacesAutocompleteForShipping = (target, handleFillData) => {
    googleMap.componentRestrictions.country = this.countryCode || googleMap.componentRestrictions.country;
    this.inputGoogleMapShipping = new google.maps.places.Autocomplete(target, {
      types: googleMap.types,
      componentRestrictions: googleMap.componentRestrictions,
    });
    this.inputGoogleMapShipping.setFields(["address_component"]);
    this.inputGoogleMapShipping.addListener("place_changed", handleFillData);
  };

  initGooglePlacesAutocompleteForBilling = (target, handleFillData) => {
    googleMap.componentRestrictions.country = this.countryCode || googleMap.componentRestrictions.country;
    this.inputGoogleMapBilling = new google.maps.places.Autocomplete(target, {
      types: googleMap.types,
      componentRestrictions: googleMap.componentRestrictions,
    });
    this.inputGoogleMapBilling.setFields(["address_component"]);
    this.inputGoogleMapBilling.addListener("place_changed", handleFillData);
  };

  fillInAddressShipping = () => {
    let street;
    const target = this.shippingAddressDetailSection.querySelector(".js_address-suggestion");
    this.clearErrorMessageForAddress(target);
    const place = this.inputGoogleMapShipping.getPlace();
    console.log(place, "google address");
    if (place.address_components) {
      const shippingUnit = document.querySelector(".js_shipping-unit");
      if (shippingUnit) {
        shippingUnit.value = null;
      }
      street = this.bindValidateAddress(
        place.address_components,
        this.shippingAddressDetailSection,
        this.addressType.shipping
      );
      this.enteredDeliveryAddress = true;
      const isExistSublocal = place.address_components.find(
        (currentValue) => currentValue.types[0] === "sublocality_level_1"
      );
      for (let i = 0; i < place.address_components.length; i += 1) {
        const addressType = place.address_components[i].types[0];
        if (this.componentForm[addressType]) {
          const val = place.address_components[i][this.componentForm[addressType]];
          if (addressType === "administrative_area_level_1") {
            this.shippingAddressStateSelectBox.forceSelectKey(val);
            this.updateShippingValueInput(val, addressType);
          } else if (addressType === "locality" && isExistSublocal) {
            continue;
          } else {
            this.updateShippingValueInput(val, addressType);
          }
        }
      }
    }

    if (street !== null && street !== undefined && street.length !== 0) {
      const shippingInput = this.shippingAddressDetailSection.querySelector(`#shipping_${street.type}`);
      if (shippingInput) shippingInput.value = street.value;
    }
  };

  updateShippingValueInput = (val, addressType) => {
    let shippingInput = this.shippingAddressDetailSection.querySelector(`#shipping_${addressType}`);
    if (shippingInput) {
      shippingInput.value = val;
    } else {
      shippingInput = this.shippingAddressDetailSection.querySelector(`.js_shipping_${addressType}`);
      if (shippingInput) {
        shippingInput.value = val;
      }
    }
  };

  fillInAddressBilling = () => {
    const target = this.billingAddressDetailSection.querySelector(".js_address-suggestion");
    this.clearErrorMessageForAddress(target);
    const place = this.inputGoogleMapBilling.getPlace();
    console.log(place, "google address");
    if (place.address_components) {
      const billingUnit = document.querySelector(".js_billing-unit");
      if (billingUnit) {
        billingUnit.value = null;
      }
      const street = this.bindValidateAddress(
        place.address_components,
        this.billingAddressDetailSection,
        this.addressType.billing
      );
      this.enteredBillingAddress = true;
      const isExistSublocal = place.address_components.find(
        (currentValue) => currentValue.types[0] === "sublocality_level_1"
      );
      for (let i = 0; i < place.address_components.length; i += 1) {
        const addressType = place.address_components[i].types[0];
        if (this.componentForm[addressType]) {
          const val = place.address_components[i][this.componentForm[addressType]];
          if (addressType === "administrative_area_level_1") {
            this.billingAddressStateSelectBox.forceSelectKey(val);
            this.updateBillingAddressInput(val, addressType);
          } else if (addressType === "locality" && isExistSublocal) {
            continue;
          } else {
            this.updateBillingAddressInput(val, addressType);
          }
        }
      }

      if (street !== null && street !== undefined && street.length !== 0) {
        const billingInput = this.billingAddressDetailSection.querySelector(`#billing_${street.type}`);
        if (billingInput) billingInput.value = street.value;
      }
    }
  };

  updateBillingAddressInput = (val, addressType) => {
    let addressControl = this.billingAddressDetailSection.querySelector(`#billing_${addressType}`);
    if (addressControl) {
      addressControl.value = val;
    } else {
      addressControl = this.billingAddressDetailSection.querySelector(`.js_billing_${addressType}`);
      if (addressControl) {
        addressControl.value = val;
      }
    }
  };

  fragmentFromString = (strHTML) => document.createRange().createContextualFragment(strHTML);

  validateSelectBoxShipping = () => {
    const hiddenState = this.shippingAddressDetailSection.querySelector("#shipping_administrative_area_level_1");
    if (hiddenState) {
      const { parentNode } = hiddenState;
      const errorElement = parentNode.querySelector(".validation-error");
      if (hiddenState.value === undefined || hiddenState.value === null || hiddenState.value === "") {
        if (errorElement === undefined || errorElement == null) {
          const errorMess = this.fragmentFromString(
            `<div class='validation-error'>${hiddenState.dataset.valuemissing}</div>`
          );
          parentNode.appendChild(errorMess);
        }
        return false;
      }
      if (errorElement) parentNode.removeChild(errorElement);
    }
    return true;
  };

  validateSelectBoxBilling = () => {
    const hiddenState = this.billingAddressDetailSection.querySelector("#billing_administrative_area_level_1");
    if (hiddenState) {
      const { parentNode } = hiddenState;
      const errorElement = parentNode.querySelector(".validation-error");
      if (hiddenState.value === undefined || hiddenState.value === null || hiddenState.value === "") {
        if (errorElement === undefined || errorElement == null) {
          const errorMess = this.fragmentFromString(
            `<div class='validation-error'>${hiddenState.dataset.valuemissing}</div>`
          );
          parentNode.appendChild(errorMess);
        }
        return false;
      }
      if (errorElement) parentNode.removeChild(errorElement);
    }
    return true;
  };

  validateAddressShippingInput = () => {
    const shippingAddressSuggestion = this.shippingAddressDetailSection.querySelector(".js_address-suggestion");
    if (shippingAddressSuggestion) {
      if (this.manuallyShipping) return true;

      if (this.enteredDeliveryAddress) return true;

      this.renderErrorMessageForAddress(shippingAddressSuggestion);
      return false;
    }
    return true;
  };

  validateAddressBillingInput = () => {
    const billingAddressSuggestion = this.billingAddressDetailSection.querySelector(".js_address-suggestion");
    if (billingAddressSuggestion) {
      if (this.manuallyBilling) return true;

      if (this.enteredBillingAddress) return true;

      this.renderErrorMessageForAddress(billingAddressSuggestion);
      return false;
    }
    return true;
  };

  validateSuburbAddressShipping = (target) => {
    if (this.enteredDeliveryAddress) {
      const suburbShippingAddress = this.shippingAddressDetailSection.querySelector("#shipping_locality");
      if (suburbShippingAddress) {
        if (suburbShippingAddress.value) {
          return true;
        }
        this.renderErrorMessageForAddress(target);
        return false;
      }
      return true;
    }
    return true;
  };

  validateSuburbAddressBilling = (target) => {
    if (this.enteredBillingAddress) {
      const suburbBillingAddress = this.billingAddressDetailSection.querySelector("#billing_locality");
      if (suburbBillingAddress) {
        if (suburbBillingAddress.value) {
          return true;
        }
        this.renderErrorMessageForAddress(target);
        return false;
      }
      return true;
    }
    return true;
  };

  renderErrorMessageForAddress = (target) => {
    if (target.parentNode.querySelector(".validation-error")) return;
    const errorMess = this.fragmentFromString(
      "<div class='validation-error'>Invalid address, please choose from list suggestion or enter manually</div>"
    );
    target.parentNode.insertBefore(errorMess, target.nextSibling);
  };

  clearErrorMessageForAddress = (target) => {
    const errorNode = target.parentNode.querySelector(".validation-error");
    if (errorNode) {
      errorNode.remove();
    }
  };

  geolocate = (e) => {
    const { target } = e;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.updatePosition(position, target);
      });
    }
  };

  updatePosition = (position, target) => {
    const geolocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    const circle = new google.maps.Circle({
      center: geolocation,
      radius: position.coords.accuracy,
    });
    this.inputGoogleMapShipping.setBounds(circle.getBounds());
  };
}
