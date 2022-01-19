import { mathjaxRefresh } from '..'

describe('lib/mathjax', () => {
  test('mathjaxRefresh', () => {
    // No mathjax
    mathjaxRefresh()

    // typesetPromise failed
    Object.defineProperty(window, 'MathJax', {
      value: {
        typesetPromise: async () => {
          throw new Error('typesetPromise error')
        }
      },
      configurable: true
    })
    mathjaxRefresh()

    // Normal
    Object.defineProperty(window, 'MathJax', {
      value: {
        typesetPromise: async () => {
          // Ok
        }
      },
      configurable: true
    })
    mathjaxRefresh()

    // Max retry
    for (let i = 0; i < 1000; ++i) mathjaxRefresh()
  })
})
