import { mathjaxInit, mathjaxRefresh } from '..'

describe('lib/mathjax', () => {
  test('mathjaxInit', () => {
    // Normal
    window.MathJax = undefined
    mathjaxInit()

    // Already exists
    window.MathJax = undefined
    mathjaxInit()

    // Already loaded
    window.MathJax = {
      typesetPromise: async () => {
        // Ok
      }
    }
    mathjaxInit()
  })

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
    for (let i = 0; i < 1000; ++i) mathjaxRefresh()
  })
})
