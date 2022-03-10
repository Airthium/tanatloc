/** @module Lib.Mathjax */

const maxRretry = 100
let nRetry = 0

/**
 * Mathjax init
 */
export const mathjaxInit = (): void => {
  // const MathJaxSource = '/mathjax/tex-mml-chtml.js'
  const MathJaxSource =
    'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'

  if (!window.MathJax) {
    console.info('MathJax::init')
    const head = document.getElementsByTagName('head')[0]
    //@ts-ignore
    for (const child of head.children) {
      if (child?.src === MathJaxSource) return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = MathJaxSource
    script.async = true
    script.defer = true
    document.getElementsByTagName('head')[0].appendChild(script)
  }
}

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

const mathjaxRetry = (func: Function): void => {
  nRetry++
  if (nRetry <= maxRretry) {
    // Retry if error
    setTimeout(func, 50)
  } else {
    console.warn('MathJax::Max retry number reached. No retry')
  }
}
