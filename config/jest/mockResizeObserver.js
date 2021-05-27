if (typeof window !== 'undefined') {
  class ResizeObserver {
    disconnect() {}
    observe() {}
    unobserve() {}
  }
  window.ResizeObserver = ResizeObserver
}
