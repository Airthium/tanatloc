/** @module Lib.Mathjax */

const maxRretry = 100
let nRetry = 0

/**
 * MathJax refresh (using typesetPromise)
 */
export const mathjaxRefresh = (): void => {
  if (!window.MathJax) {
    mathjaxRetry(mathjaxRefresh)
    return
  }

  window.MathJax.typesetPromise().catch(() => {
    console.warn('MathJax::typeset failed')
    mathjaxRetry(mathjaxRefresh)
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
