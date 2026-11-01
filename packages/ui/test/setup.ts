import '@testing-library/jest-dom';

// jsdom has no layout or pointer capture; browser checks cover positioning/gestures.
if (typeof window !== 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {
      /* No layout engine in jsdom. */
    }
    unobserve() {
      /* No layout engine in jsdom. */
    }
    disconnect() {
      /* No layout engine in jsdom. */
    }
  };
  HTMLElement.prototype.hasPointerCapture = () => false;
  HTMLElement.prototype.setPointerCapture = () => {
    /* Browser-only capture. */
  };
  HTMLElement.prototype.releasePointerCapture = () => {
    /* Browser-only capture. */
  };
}
