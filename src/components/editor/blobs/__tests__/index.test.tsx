import { render } from '@testing-library/react'

import Blobs, { addOnCursor } from '..'

jest.mock('../header', () => () => <div />)
jest.mock('../dimension', () => () => <div />)
jest.mock('../mesh', () => () => <div />)
jest.mock('../materials', () => () => <div />)
jest.mock('../finiteElementSpace', () => () => <div />)
jest.mock('../finiteElementFunction', () => () => <div />)
jest.mock('../macros', () => () => <div />)
jest.mock('../solver', () => () => <div />)
jest.mock('../save', () => () => <div />)
jest.mock('../data', () => () => <div />)
jest.mock('../sensors', () => () => <div />)

describe('components/editor/blobs', () => {
  const dispatch = jest.fn()
  beforeEach(() => {
    dispatch.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Blobs />)

    unmount()
  })

  test('addOnCursor', () => {
    addOnCursor('', 'text', undefined, dispatch)
    expect(dispatch).toHaveBeenCalledTimes(1)

    addOnCursor('template', 'text', undefined, dispatch)
    expect(dispatch).toHaveBeenCalledTimes(2)

    addOnCursor('', 'text', { row: 0, column: 0 }, dispatch)
    expect(dispatch).toHaveBeenCalledTimes(3)

    addOnCursor('template', 'text', { row: 0, column: 0 }, dispatch)
    expect(dispatch).toHaveBeenCalledTimes(4)
  })
})
