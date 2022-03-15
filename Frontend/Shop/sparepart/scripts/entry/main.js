// Require the polyfill before requiring any other modules.
import '@babel/polyfill';
import 'intersection-observer';
import 'url-search-params-polyfill';
import ComponentLoader from '../setup/component-loader';
import registerWindowOnScroll, { handleScroll } from '../../../core/scripts/ultis/scroll';
import { responsiveBackgroud, debounceResponsiveImg, responsiveOnResizeWindow } from '../../../core/scripts/ultis/responsivebackground';
import lazyloadImg from '../../../core/scripts/ultis/lazyloadImg';
import { containsMany, containsAny, removeElement,addScript } from '../../../core/scripts/ultis/dom';
import closest from '../../../core/scripts/ultis/closest';
import { route } from '../../../core/scripts/ultis/route';
// import picturefill from 'picturefill';
let hasClickOnLogin = false;
let hasLoadedSAPScript = false;
let loadingScript = false;
function init() {
  ComponentLoader.loadComponents(document);
  window.addEventListener('scroll', handleScroll);
  removeElement();
  responsiveBackgroud();
  registerWindowOnScroll(() => debounceResponsiveImg(), 'debounceResponsiveImg');
  responsiveOnResizeWindow();
  lazyloadImg.DoObserver();
  closest();
  containsMany();
  containsAny();
  initSAPScriptForActivationPage();
  // if(isIE)
  // {
  //   picturefill();
  // }
};
init();

const isDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isDevice) {
  document.querySelector('body').style.cursor = 'pointer';
};

function initSAPScriptForActivationPage(){
  const idsActivation = route.getParam('IDSactivation');
  if (idsActivation) {
    loadLazyScript()
  }
}

function handleLoadedScript(){
  hasLoadedSAPScript = true;
  // if(hasClickOnLogin){
  //   var sap_sso = document.getElementById("SAP_SSO");
  //   if(sap_sso){
  //     sap_sso.click();
  //   }
  // }
  hasClickOnLogin = false;
};
function loadLazyScript() {    
    const el = document.getElementById("SAPSCRIPT");
    if(el)
    {
      addScript('/dist/sparepart/scripts/jquery/jquery-3.5.1.min.js', function(){});
      const src = el.dataset.src;
      addScript(src, handleLoadedScript);
    }
};
function handlelazyLoadScript(event) {
  if(event.target.classList && event.target.classList.containsAny("js_sap__login")){
    hasClickOnLogin = true;
    if(!hasLoadedSAPScript){
      event.preventDefault();
      event.stopPropagation();
    }
  }
  if(!loadingScript){
    loadingScript = true;
    loadLazyScript();
  }
  document.removeEventListener("scroll", handlelazyLoadScript);
  document.removeEventListener("click", handlelazyLoadScript);
  document.removeEventListener("mousemove", handlelazyLoadScript);
};

document.addEventListener("click", handlelazyLoadScript);
document.addEventListener("scroll", handlelazyLoadScript);
document.addEventListener("mousemove", handlelazyLoadScript);