import { globalStyleFn } from '..'

describe('styles/index', () => {
  test('globalStyleFn', () => {
    globalStyleFn.margin(10)
    globalStyleFn.margin('auto')

    globalStyleFn.marginTop(10)
    globalStyleFn.marginTop('auto')

    globalStyleFn.marginRight(10)
    globalStyleFn.marginRight('auto')

    globalStyleFn.marginBottom(10)
    globalStyleFn.marginBottom('auto')

    globalStyleFn.marginLeft(10)
    globalStyleFn.marginLeft('auto')

    globalStyleFn.padding(10)
    globalStyleFn.padding('auto')

    globalStyleFn.paddingTop(10)
    globalStyleFn.paddingTop('auto')

    globalStyleFn.paddingRight(10)
    globalStyleFn.paddingRight('auto')

    globalStyleFn.paddingBottom(10)
    globalStyleFn.paddingBottom('auto')

    globalStyleFn.paddingLeft(10)
    globalStyleFn.paddingLeft('auto')

    globalStyleFn.maxWidth(100)
    globalStyleFn.maxWidth('100vw')
  })
})
