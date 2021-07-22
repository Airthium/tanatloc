if (typeof window !== 'undefined') {
  class ResizeObserver {
    disconnect() {
      // mock method
    }
    observe() {
      // mock method
    }
    unobserve() {
      // mock method
    }
  }
  window.ResizeObserver = ResizeObserver
}
