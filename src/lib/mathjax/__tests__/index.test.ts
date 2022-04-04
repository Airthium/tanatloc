import { mathjaxRefresh } from '..'

describe('lib/mathjax', () => {
  test('mathjaxRefresh', () => {
    // No mathjax
    window.MathJax = undefined
    mathjaxRefresh()

    // typesetPromise failed
    window.MathJax = {
      typesetPromise: async () => {
        throw new Error('typesetPromise error')
      }
    }
    mathjaxRefresh()

    // Normal
    window.MathJax = {
      typesetPromise: async () => {
        // Ok
      }
    }
    mathjaxRefresh()

    // Max retry
    window.MathJax = {
      typesetPromise: async () => {
        throw new Error('typesetPromise error')
      }
    }
    for (let i = 0; i < 1000; ++i) mathjaxRefresh()
  })
})
