import { mathjaxRefresh } from '..'

Object.defineProperty(global, 'setTimeout', {
  value: (callback: Function) => {
    callback()
  }
})

describe('lib/mathjax (2)', () => {
  test('mathjaxRefresh', async () => {
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
