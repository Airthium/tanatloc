import { mathjaxRefresh } from '..'

Object.defineProperty(global, 'setTimeout', {
  value: (callback: Function) => {
    callback()
  }
})

describe('lib/mathjax', () => {
  test('mathjaxRefresh', async () => {
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
  })
})
