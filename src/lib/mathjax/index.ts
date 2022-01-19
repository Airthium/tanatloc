const maxRretry = 1000
let nRetry = 0

/**
 * MathJax refresh (using typesetPromise)
 */
const mathjaxRefresh = () => {
  window.MathJax.typesetPromise().catch(() => {
    console.warn('MathJax::typeset failed')
    nRetry++
    if (nRetry <= maxRretry) {
      // Retry if error
      console.warn('MathJax::retry number ' + nRetry)
      setTimeout(mathjaxRefresh, 50)
    } else {
      console.warn('MathJax::Max retry number reached. No retry')
    }
  })
}

export { mathjaxRefresh }
