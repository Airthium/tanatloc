import { fireEvent, render, screen } from '@testing-library/react'

import FreeFEMCode from '..'

const mockReactAce = jest.fn()
jest.mock('react-ace', () => (props: any) => mockReactAce(props))

jest.mock('ace-builds/src-noconflict/theme-sqlserver', () => {})

jest.mock('../mode/mode-freefem-ejs', () => {})

describe('components/editor/code/freefem_editor', () => {
  beforeEach(() => {
    mockReactAce.mockReset()
    mockReactAce.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(<FreeFEMCode />)

    unmount()
  })

  test('onChange, empty', () => {
    mockReactAce.mockImplementation((props) => (
      <div role="ReactAce" onClick={() => props.onChange()} />
    ))
    const { unmount } = render(<FreeFEMCode />)

    const editor = screen.getByRole('ReactAce')
    fireEvent.click(editor)

    unmount()
  })

  test('onChange, some text', () => {
    mockReactAce.mockImplementation((props) => (
      <div role="ReactAce" onClick={() => props.onChange('some text')} />
    ))
    const { unmount } = render(<FreeFEMCode />)

    const editor = screen.getByRole('ReactAce')
    fireEvent.click(editor)

    unmount()
  })

  test('onCursorChange', () => {
    mockReactAce.mockImplementation((props) => (
      <div
        role="ReactAce"
        onClick={() =>
          props.onCursorChange({
            cursor: {
              row: 1,
              column: 2
            }
          })
        }
      />
    ))
    const { unmount } = render(<FreeFEMCode />)

    const editor = screen.getByRole('ReactAce')
    fireEvent.click(editor)

    unmount()
  })
})
