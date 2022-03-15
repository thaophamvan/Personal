class PropagationStopper {
  constructor(element) {
    element.addEventListener('click', (event) => {
      event.stopPropagation();
      return false;
    });
  }
}

export default PropagationStopper;
