import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import FreeFEMCode from '..'

const mockReactAce = jest.fn()
jest.mock('react-ace', () => (props: any) => mockReactAce(props))

jest.mock('ace-builds/src-noconflict/theme-one_dark', () => {})

jest.mock('ace-builds/src-noconflict/ext-language_tools', () => ({
  setCompleters: (completers: any[]) => {
    completers[0].getCompletions(0, 0, 0, 0, jest.fn)
  }
}))

jest.mock('../mode/mode-freefem-ejs', () => {})

const mockRef = jest.fn()
jest.mock('react', () => {
  return {
    ...jest.requireActual<typeof React>('react'),
    useRef: () => mockRef()
  }
})

jest.mock('../tooltip', () => () => <div />)

let timeoutCount = -1
Object.defineProperty(global, 'setTimeout', {
  value: (callback: Function) => {
    timeoutCount++
    callback()
    return timeoutCount
  }
})

describe('components/editor/code/freefem_editor', () => {
  beforeEach(() => {
    mockReactAce.mockReset()
    mockReactAce.mockImplementation(() => <div />)

    mockRef.mockReset()
    mockRef.mockImplementation(() => ({}))
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

  test('ref', () => {
    let count = 0
    const ace = {
      focus: jest.fn,
      editor: {
        on: (_type: string, callback: Function) => {
          callback({})
          callback({})
          callback({})
          callback({})
          callback({})
        },
        renderer: {
          pixelToScreenCoordinates: jest.fn,
          textToScreenCoordinates: jest.fn
        },
        container: {
          classList: {
            add: jest.fn
          },
          addEventListener: jest.fn,
          removeEventListener: jest.fn,
          getBoundingClientRect: jest.fn
        },
        session: {
          getTokenAt: () => {
            count++
            if (count === 1) return {}
            else if (count === 2 || count === 3)
              return { type: 'support.function', value: 'abs' }
            else if (count === 4)
              return { type: 'support.other', value: 'unknown' }
            else return undefined
          },
          getWordRange: () => ({
            start: { row: 1, column: 1 }
          })
        }
      }
    }
    mockRef.mockImplementationOnce(() => ({
      current: ace
    }))
    const { unmount } = render(<FreeFEMCode />)

    unmount()
  })
})
