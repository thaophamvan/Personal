let instance;

class LoadingScreen {
  constructor() {
    if (instance) {
      return instance;
    }

    this.container = document.querySelector('.js_loading-screen');
    instance = this;
  }

  hide() {
    this.container.classList.add('hide');
  }

  show() {
    this.container.classList.remove('hide');
  }
}

export default new LoadingScreen();
