import { fireEvent, render, screen } from '@testing-library/react'

import JSONEditor from '..'

const mockReactAce = jest.fn()
jest.mock('react-ace', () => (props: any) => mockReactAce(props))

jest.mock('ace-builds/src-noconflict/mode-json5', () => {})
jest.mock('ace-builds/src-noconflict/theme-sqlserver', () => {})

describe('components/editor/code/json_editor', () => {
  beforeEach(() => {
    mockReactAce.mockReset()
    mockReactAce.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(<JSONEditor />)

    unmount()
  })

  test('onChange, empty', () => {
    mockReactAce.mockImplementation((props) => (
      <div role="ReactAce" onClick={() => props.onChange()} />
    ))
    const { unmount } = render(<JSONEditor />)

    const editor = screen.getByRole('ReactAce')
    fireEvent.click(editor)

    unmount()
  })

  test('onChange, some text', () => {
    mockReactAce.mockImplementation((props) => (
      <div role="ReactAce" onClick={() => props.onChange('some text')} />
    ))
    const { unmount } = render(<JSONEditor />)

    const editor = screen.getByRole('ReactAce')
    fireEvent.click(editor)

    unmount()
  })
})
