import { last, outerHeight } from './dom';
import { debounce } from './obj';

const resizeIFrameToFitContent = function(timeout) {
  if (window.self !== window.top) {
    setTimeout(() => {
      if (window.parent) {
        const iframes = window.parent.document.querySelectorAll('iframe');
        if (iframes.length > 0) {
          const iFrame = iframes[0];
          // var footer = $('.footer').last();
          const footer = last(Array.from(document.querySelectorAll('.footer')));
          let footerHeight;
          // if (footer.css("position") == "absolute") {
          if (footer && footer.style.position === 'absolute') {
            footerHeight = outerHeight(footer);
          } else {
            footerHeight = 0;
          }
          const newHeight = document.body.scrollHeight + footerHeight;
          iFrame.height = newHeight;
          iFrame.style.height = `${newHeight}px`;
        }
      }
    }, timeout);
  }
};

export function responsiveBackgroud() {
  const windowHeight = window.innerHeight;
  const viewportTop = window.pageYOffset;
  Array.from(document.body.querySelectorAll('img.lazy')).forEach((element) => {
    const parentElement = element.parentNode;
    const elementTop = parentElement.offsetTop;
    const elementBottom = elementTop + outerHeight(element.parentNode);
    if (elementTop - windowHeight < viewportTop + 150 && viewportTop < elementBottom - 150 && parentElement.offsetWidth > 0 && parentElement.offsetHeight > 0) {
      let bgimg;
      if (element.hasAttribute('data-img-mobile') && element.hasAttribute('data-img-desktop')) {
        if (window.innerWidth < 992) {
          bgimg = element.getAttribute('data-img-mobile');
        } else {
          bgimg = element.getAttribute('data-img-desktop');
        }
      } else bgimg = element.getAttribute('src');
      const bgDefault = element.getAttribute('data-default');
      element.setAttribute('src', bgDefault);
      if (bgimg){
        parentElement.style.backgroundImage = `url(${bgimg})`;
      }
      
      parentElement.style.backgroundSize = element.getAttribute('data-background-size') || 'cover';
      parentElement.style.display = 'block';
      const nextElement = element.nextElementSibling;
      if (nextElement) {
        if (nextElement.classList.contains('block-img-text__content') || nextElement.classList.contains('card-img-bg__content')) {
          nextElement.style.position = 'unset';
          nextElement.style.height = 'auto';
          const minHeight = outerHeight(nextElement);
          nextElement.removeAttribute('style');
          parentElement.style.minHeight = `${minHeight}px`;
          if (bgimg)
          {
            parentElement.style.backgroundImage = `url(${bgimg})`;
          } 
          parentElement.style.backgroundSize = element.getAttribute('data-background-size') || 'cover';
          parentElement.style.display = 'block';
        }
      }
    }
  });

  resizeIFrameToFitContent(500);
}

export function responsiveOnResizeWindow() {
  let width = window.innerWidth;
  let resize = 0;
  window.addEventListener('resize', () => {
    resize += 1;
    setTimeout(() => {
      resize -= 1;
      if (resize === 0) {
        if (window.innerWidth !== width) {
          width = window.innerWidth;
          responsiveBackgroud();
        }
      }
    }, 100);
  });
}

export function debounceResponsiveImg() {
  return debounce(responsiveBackgroud(), 200);
}
