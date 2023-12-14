import { render } from '@testing-library/react'

import useCustomEffect from '../useCustomEffect'

describe('src/components/utils/useCustomEffect', () => {
  test('empty', () => {
    const Component = () => {
      useCustomEffect(() => {
        console.debug('ok')
      })
      return null
    }
    const { unmount } = render(<Component />)

    unmount()
  })

  test('with updaters', () => {
    let arrayRef = [1, 2, 3]
    const Component = () => {
      const array = arrayRef
      useCustomEffect(() => {
        console.debug('ok')
      }, [array])
      return null
    }
    const { rerender, unmount } = render(<Component />)
    rerender(<Component />)

    arrayRef = [2, 3]

    rerender(<Component />)

    unmount()
  })

  test('with updaters and dependencies', () => {
    const Component = () => {
      const array = [1]
      const dep = jest.fn
      useCustomEffect(
        () => {
          console.debug('ok')
        },
        [array],
        [dep]
      )
      return null
    }
    const { unmount } = render(<Component />)

    unmount()
  })
})
