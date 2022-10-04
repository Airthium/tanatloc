import { render } from '@testing-library/react'

import Code from '..'

jest.mock('../freefem_editor', () => () => <div />)
jest.mock('../json_editor', () => () => <div />)

describe('components/editor/code', () => {
  test('render', () => {
    const { unmount } = render(<Code />)

    unmount()
  })
})
