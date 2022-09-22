/** @module Lib.Mathjax */

const maxRretry = 100
let nRetry = 0

/**
 * MathJax refresh (using typesetPromise)
 */
export const mathjaxRefresh = (elements?: HTMLDivElement[]): void => {
  if (!window.MathJax) {
    mathjaxRetry(() => mathjaxRefresh(elements))
    return
  }

  window.MathJax.typesetPromise(elements).catch(() => {
    console.warn('MathJax::typeset failed')
    mathjaxRetry(() => mathjaxRefresh(elements))
  })
}

const mathjaxRetry = (func: () => void): void => {
  nRetry++
  if (nRetry <= maxRretry) {
    // Retry if error
    setTimeout(func, 50)
  } else {
    console.warn('MathJax::Max retry number reached. No retry')
  }
}
