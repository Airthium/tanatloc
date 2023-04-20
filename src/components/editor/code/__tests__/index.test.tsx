import { fireEvent, render } from '@testing-library/react'

import Code from '..'

jest.mock('@/components/assets/sidePanels', () => () => <div />)

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
