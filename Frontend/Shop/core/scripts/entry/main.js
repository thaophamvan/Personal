// Require the polyfill before requiring any other modules.
import '@babel/polyfill';
import 'intersection-observer';
import ComponentLoader from '../setup/component-loader';
import closest from '../ultis/closest';
import { containsMany, containsAny, removeElement } from '../ultis/dom';
import { responsiveBackgroud, debounceResponsiveImg, responsiveOnResizeWindow } from '../ultis/responsivebackground';
import LazyLoadImg from '../ultis/lazyloadImg';
import registerWindowOnScroll, { handleScroll } from '../ultis/scroll';

function init() {
  ComponentLoader.loadComponents(document);
  window.addEventListener('scroll', handleScroll);
  removeElement();
  responsiveBackgroud();
  registerWindowOnScroll(() => debounceResponsiveImg(), 'debounceResponsiveImg');
  responsiveOnResizeWindow();
  LazyLoadImg.DoObserver();
  closest();
  containsMany();
  containsAny();
}

init();

const isDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isDevice) {
  document.querySelector('body').style.cursor = 'pointer';
}
