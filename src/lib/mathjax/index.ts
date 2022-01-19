const maxRretry = 1000
let nRetry = 0

/**
 * MathJax refresh (using typesetPromise)
 */
const mathjaxRefresh = (): void => {
  try {
    window.MathJax.typesetPromise().catch(() => {
      console.warn('MathJax::typeset failed')
      mathjaxRetry(mathjaxRefresh)
    })
  } catch (err) {
    console.warn('MathJax::MathJax is not loaded yet')
    mathjaxRetry(mathjaxRefresh)
  }
}

const mathjaxRetry = (func: Function): void => {
  nRetry++
  if (nRetry <= maxRretry) {
    // Retry if error
    console.warn('MathJax::retry number ' + nRetry)
    setTimeout(func, 50)
  } else {
    console.warn('MathJax::Max retry number reached. No retry')
  }
}

export { mathjaxRefresh }
