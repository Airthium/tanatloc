import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { EditorContext } from '@/context/editor'

import FreeFEMCode from '..'

const mockReactAce = jest.fn()
jest.mock('react-ace', () => (props: any) => mockReactAce(props))

jest.mock('ace-builds/src-noconflict/theme-one_dark', () => {})
jest.mock('ace-builds/src-noconflict/ext-searchbox', () => {})

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

describe('components/editor/code/freefem_editor', () => {
  let count = 0
  const ace = {
    focus: jest.fn,
    editor: {
      getCursorPosition: () => ({
        row: 1
      }),
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
        addEventListener: (_: any, callback: Function) => {
          callback({
            clipboardData: {
              getData: () => 'text\ntext'
            }
          })
        },
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
        }),
        addMarker: () => 'id',
        removeMarker: jest.fn
      }
    }
  }

  beforeEach(() => {
    mockReactAce.mockReset()
    mockReactAce.mockImplementation(() => <div />)

    mockRef.mockReset()
    mockRef.mockImplementation(() => ({ current: ace }))
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

  test('context', () => {
    mockRef.mockImplementationOnce(() => ({
      current: {
        editor: {
          container: {
            addEventListener: jest.fn,
            removeEventListener: jest.fn,
            classList: {
              add: jest.fn
            }
          },
          session: {
            addMarker: jest.fn,
            removeMarker: jest.fn
          },
          on: jest.fn,
          moveCursorTo: jest.fn
        }
      }
    }))
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

    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: '',
          model: '',
          templateValid: true,
          modelValid: true,
          templateHighlight: { begin: 1, end: 10 },
          templateCursor: { row: 1, column: 0 },
          dispatch: jest.fn()
        }}
      >
        <FreeFEMCode />
      </EditorContext.Provider>
    )

    const editor = screen.getByRole('ReactAce')
    fireEvent.click(editor)

    unmount()
  })
})
