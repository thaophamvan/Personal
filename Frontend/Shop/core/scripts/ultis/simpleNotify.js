/* -----------------------------------------------------------------------------

simpleNotify.js
A simple notifications library built with pure javascript and no dependancies.
Copyright Drew Warkentin 2016. All rights reserved.

To do:
-Add a close button to close notifications => done
-Add notification show time => done
-Add support for non auto-dismissing notifications => done
----------------------------------------------------------------------------- */

const simpleNotify = {
  // Some important variables
  NOTIFICATION_CLASS_NAME: 'simple-notification',
  CONTAINER_CLASS_NAME: 'simple-notification-container',
  CONTAINER_ID_NAME: 'notificationContainer',
  MARGIN_BETWEEEN_NOTIFICATIONS: 5, // px
  // NOTIFICATION_WIDTH: 415, // px
  NOTIFICATION_TIME: 5000, // ms
  AUTO_DISMISSING: true,
  LEVEL: 'good',
  notificationCount: 0,

  notify(options = { message: '', level: null, className: '' }) {
    if (!options.message)
      return;

    // arguments
    this.options = options;
    // custom dismissing
    simpleNotify.AUTO_DISMISSING = this.options.autoDismissing || true;
    // custom container
    simpleNotify.EX_CONTAINER_CLASS_NAME = this.options.exContainerClassName || '';
    // custom level
    simpleNotify.LEVEL = this.options.level || 'good';
    // custom timeout
    simpleNotify.NOTIFICATION_TIME = typeof this.options.notificationTime !== 'undefined' && typeof this.options.notificationTime === 'number' ? this.options.notificationTime : 5000;
    simpleNotify.notificationCount += 1;
    const notificationId = `notification${simpleNotify.notificationCount}`;
    const newNotification = {
      id: notificationId,
      message: this.options.message,
      level: simpleNotify.LEVEL,
      className: this.options.className,
    };
    // If we don't have the notification container already on the page, create it
    this.container = document.getElementById(simpleNotify.CONTAINER_ID_NAME);
    if (this.container) {
      // hide before show previous before show
      // simpleNotify.removeAllNotification(this.container);
      // show the notification
      simpleNotify.showNotification(newNotification);
    } else {
      // create the container
      simpleNotify.createContainer();
      // show the notification
      simpleNotify.showNotification(newNotification);
    }
  },

  // This function creates the container for the notifications to be render in
  createContainer() {
    const divContainer = document.createElement('div');
    divContainer.className = simpleNotify.CONTAINER_CLASS_NAME;
    if (simpleNotify.EX_CONTAINER_CLASS_NAME !== '') {
      divContainer.classList.add(simpleNotify.EX_CONTAINER_CLASS_NAME);
    }

    divContainer.id = simpleNotify.CONTAINER_ID_NAME;
    this.container = divContainer;
    document.body.appendChild(divContainer);
  },

  successMessage(message) {
    const template = `<span class="icon-success"><span class="path1"></span><span class="path2">
    </span><span class="path3"></span></span>
    <span class="simple-notification__text-content">${message}</span>
    <span class='icon__cross js_close-notification'></span>`;
    return template;
  },

  errorMessage(message) {
    const template = `<span class="icon-error"><span class="path1"></span><span class="path2">
    </span><span class="path3"></span></span>
    <span class="simple-notification__text-content">${message}</span>
    <span class='icon__cross js_close-notification'></span>`;
    return template;
  },

  showNotification(notification) {
    // Create the new notification element
    const newNotification = document.createElement('div');
    newNotification.className = `${simpleNotify.NOTIFICATION_CLASS_NAME} ${notification.level}`;
    newNotification.id = notification.id;
    // newNotification.innerHTML =  `${notification.message}<div class='close-notification'></div>`;
    newNotification.innerHTML = simpleNotify.LEVEL === 'good' ? simpleNotify.successMessage(notification.message) : simpleNotify.errorMessage(notification.message);
    // newNotification.style.marginLeft = `${simpleNotify.NOTIFICATION_WIDTH
    //   + 10}px`;
    // Create a wrapper for the notification element so that we can transition it nicely.
    const notificationWrapper = document.createElement('div');
    notificationWrapper.className = 'simple-notification-wrapper js_simple-notification-wrapper';
    notificationWrapper.appendChild(newNotification);
    // Add it to the DOM
    this.container.insertBefore(notificationWrapper, this.container.firstChild);
    setTimeout(() => {
      this.container.classList.add('active');
    }, 10);

    this.container.querySelector('.js_close-notification').addEventListener('click', simpleNotify.forceClose);
    //   document.querySelector('.simple-notification').addEventListener(
    //   'transitionend',
    //   () => {document.querySelector('.simple-notification').style.marginLeft = 0;},
    //   false,
    // );
    // notificationContainer.querySelector('.close-notification')[0].addEventListener('click', simpleNotify.forceClose);
    // if auto_dismissing equal true
    if (simpleNotify.AUTO_DISMISSING) {
      // Destroy the notification after the set time
      setTimeout(() => {
        simpleNotify.removeNotification(newNotification);
      }, simpleNotify.NOTIFICATION_TIME);
    }
  },

  close(notification) {
    simpleNotify.removeNotification(notification);
  },

  forceClose(event) {
    const { target } = event;
    simpleNotify.removeNotification(target.parentElement);
  },

  removeNotification(notificationToRemove) {
    notificationToRemove.className += ' fade-out';
    // Remove the notification from the DOM after the fade out has finished
    notificationToRemove.addEventListener(
      'transitionend',
      () => {
        this.container.removeChild(notificationToRemove.parentElement);
        this.container.classList.remove('active');
      },
      false,
    );
  },
  removeAllNotification(container) {
    const notifiers = container.querySelectorAll('.js_simple-notification-wrapper');
    [...notifiers].forEach((notifier) => {
      notifier.firstChild.className += ' fade-out';
      container.removeChild(notifier);
    });
    container.classList.remove('active');
  },
};
export default simpleNotify;
