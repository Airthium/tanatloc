import { mathjaxInit, mathjaxRefresh } from '..'

describe('lib/mathjax', () => {
  test('mathjaxInit', () => {
    // Normal
    window.MathJax = undefined
    document.getElementsByTagName = () => [
      //@ts-ignore
      {
        children: [],
        appendChild: jest.fn
      }
    ]
    mathjaxInit()

    // Already exists
    window.MathJax = undefined
    document.getElementsByTagName = () => [
      //@ts-ignore
      {
        // children: [undefined, { src: '/mathjax/tex-mml-chtml.js' }]
        children: [
          undefined,
          { src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js' }
        ]
      }
    ]
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
    window.MathJax = {
      typesetPromise: async () => {
        throw new Error('typesetPromise error')
      }
    }
    for (let i = 0; i < 1000; ++i) mathjaxRefresh()
  })
})
