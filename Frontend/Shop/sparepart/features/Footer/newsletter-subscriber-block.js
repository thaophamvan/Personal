import Http from '../../../core/scripts/ultis/Http';
import { API_NEWSLETTER_SUBSCRIBER } from '../../../core/scripts/constants';

class NewsletterSubscriberServices extends Http {
    emailSubscribe = (subscribeEmail) => this.get(`${API_NEWSLETTER_SUBSCRIBER}/?subscribeEmail=${subscribeEmail}`, true);
}
export default class NewsletterSubscriberBlock {
    constructor(selector) {
        this.component = selector;
        this.emailInputElt = this.component.querySelector('.js-newsletter-subscriber__email-input');
        this.successMsgElt = this.component.querySelector('.js-newsletter-subscriber__success-message');
        this.subscribeFormElt = this.component.querySelector('.js-newsletter-subscriber__form');
        this.errMsgElt = this.component.querySelector('.js-newsletter-subscriber__email-error-msg');

        this.initNewsletterSubscriber();
        this.newsletterSubscriberServices = new NewsletterSubscriberServices();
    }

    initNewsletterSubscriber() {
        const subscribeButton = this.component.querySelector('.js-newsletter-subscriber__submit-button');
        subscribeButton.addEventListener("click", (event) => this.subscribeClickHandler(event));
    }

    subscribeClickHandler = async (event) => {
        event.preventDefault();
        const responseData = await this.newsletterSubscriberServices.emailSubscribe(this.emailInputElt.value)

        if (responseData.Success) {
            this.successMsgElt.classList.add('visible');
            this.successMsgElt.innerHTML = responseData.Message;
            this.subscribeFormElt.classList.add('hidden');
            this.errMsgElt.classList.remove('visible');
        }
        else {
            this.errMsgElt.classList.add('visible');
            this.errMsgElt.innerHTML = responseData.Message;
            this.successMsgElt.classList.remove('visible');
            this.successMsgElt.innerHTML = '';
            this.subscribeFormElt.classList.remove('hidden');
        }
    }
}
