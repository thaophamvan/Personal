import { each } from 'lodash/core';

const eventCore = {};

export function broadCast(eventName, eventValue) {
  if (eventCore[eventName]) {
    each(eventCore[eventName], (listener) => {
      if (eventValue && typeof eventValue === 'object' && eventValue.length > 0) {
        const param1 = eventValue[0];
        const param2 = eventValue.length > 1 ? eventValue[1] : null;
        const param3 = eventValue.length > 2 ? eventValue[2] : null;

        listener.bind(this, param1, param2, param3)();
      } else {
        listener(eventValue);
      }
    });
  }
}

export function subscribe(eventName, listener) {
  if (eventCore[eventName]) {
    eventCore[eventName].push(listener);
  } else {
    eventCore[eventName] = [listener];
  }
}
