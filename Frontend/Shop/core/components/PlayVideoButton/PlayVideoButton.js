import Modal from '../Modal/Modal';
import popupVideoHtml from './play-video-popup.pug';
import { render } from '../../scripts/ultis/render';

class PlayVideoButton {
  constructor(element) {
    this.selector = element;
    this.src = this.selector.getAttribute('data-src');
    this.bindEventHandler();
  }

  bindEventHandler = () => {
    this.selector.addEventListener('click', this.showVideoPopup);
  };

  showVideoPopup = () => {
    this.renderPopup();
    const popup = new Modal(this.selector, this.onClosePopup);
    popup.openModal();
  };

  renderPopup = () => {
    const popupVideo = document.body.querySelector('#popupVideo');
    if (popupVideo !== undefined && popupVideo !== null) {
      popupVideo.querySelector('iframe').src = this.src;
      return;
    }
    const el = document.createElement('div');
    el.innerHTML = render(popupVideoHtml, { videoSrc: this.src });
    document.body.appendChild(el.firstChild);
  };

  onClosePopup = () => {
    const popupVideo = document.body.querySelector('#popupVideo');
    const iframeVideo = popupVideo.querySelector('iframe');
    iframeVideo.src = 'about:blank';
    iframeVideo.innerHTML = '';
  };
}

export default PlayVideoButton;
