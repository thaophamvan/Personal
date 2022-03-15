export function delay(fn, time) {
  const t = time || 300;
  setTimeout(fn, t);
}

export function compose(fn, fn1) {
  return () => fn(fn1());
}
