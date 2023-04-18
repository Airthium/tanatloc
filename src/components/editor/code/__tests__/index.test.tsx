import { fireEvent, render } from '@testing-library/react'

import Code from '..'

jest.mock('react-resizable', () => ({
  ResizableBox: (props: any) => {
    props.onResize('', { size: { width: 10 } })
    return <div />
  }
}))

jest.mock('../freefem', () => () => <div />)
jest.mock('../json', () => () => <div />)

describe('components/editor/code', () => {
  test('render', () => {
    const { unmount } = render(<Code />)

    unmount()
  })

  test('resize', () => {
    const { unmount } = render(<Code />)

    fireEvent.resize(window)

    unmount()
  })
})
