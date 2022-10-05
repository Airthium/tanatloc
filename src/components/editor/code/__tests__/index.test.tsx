import { render } from '@testing-library/react'

import Code from '..'

jest.mock('../freefem', () => () => <div />)
jest.mock('../json', () => () => <div />)

describe('components/editor/code', () => {
  test('render', () => {
    const { unmount } = render(<Code />)

    unmount()
  })
})
