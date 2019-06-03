export function loadFirst(t, n, descriptor) {
  const originalFunction = descriptor.value;

  descriptor.value = function(...args) {
    this.setState(() => ({
      loading: true,
    }));
    originalFunction.call(this, ...args);
  };

  return descriptor;
}
