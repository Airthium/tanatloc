import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { EditorContext } from '@/context/editor'

import JSONEditor from '..'

const mockRef = jest.fn()
jest.mock('react', () => {
  return {
    ...jest.requireActual<typeof React>('react'),
    useRef: () => mockRef()
  }
})

const mockReactAce = jest.fn()
jest.mock('react-ace', () => (props: any) => mockReactAce(props))

jest.mock('ace-builds/src-noconflict/mode-json5', () => {})
jest.mock('ace-builds/src-noconflict/theme-one_dark', () => {})

Object.defineProperty(global, 'setTimeout', {
  value: (callback: Function) => {
    callback()
    return 1
  }
})

describe('components/editor/code/json_editor', () => {
  beforeEach(() => {
    mockReactAce.mockReset()
    mockReactAce.mockImplementation(() => <div />)

    mockRef.mockReset()
    mockRef.mockImplementation(() => ({}))
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

  test('onChange, json', () => {
    mockReactAce.mockImplementation((props) => (
      <div role="ReactAce" onClick={() => props.onChange('{}')} />
    ))
    const { unmount } = render(<JSONEditor />)

    const editor = screen.getByRole('ReactAce')
    fireEvent.click(editor)

    unmount()
  })

  test('highlight - no ref', () => {
    mockReactAce.mockImplementation(() => <div role="ReactAce" />)

    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: '',
          model: '',
          templateValid: true,
          modelValid: true,
          jsonHighlight: { begin: 1, end: 10 },
          dispatch: jest.fn()
        }}
      >
        <JSONEditor />
      </EditorContext.Provider>
    )

    mockRef.mockImplementation(() => ({
      current: {
        editor: {}
      }
    }))

    unmount()
  })

  test('highlight - ref', () => {
    mockReactAce.mockImplementation(() => <div role="ReactAce" />)
    mockRef.mockImplementation(() => ({
      current: {
        focus: jest.fn,
        editor: {
          session: {
            addMarker: jest.fn,
            removeMarker: jest.fn,
            clearAnnotations: jest.fn
          }
        }
      }
    }))

    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: '',
          model: '',
          templateValid: true,
          modelValid: true,
          jsonHighlight: { begin: 1, end: 10 },
          dispatch: jest.fn()
        }}
      >
        <JSONEditor />
      </EditorContext.Provider>
    )

    unmount()
  })

  test('highlight - ref - jsonError', () => {
    mockReactAce.mockImplementation(() => <div role="ReactAce" />)
    mockRef.mockImplementation(() => ({
      current: {
        focus: jest.fn,
        editor: {
          session: {
            addMarker: jest.fn,
            removeMarker: jest.fn,
            setAnnotations: jest.fn,
            clearAnnotations: jest.fn
          }
        }
      }
    }))

    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: '',
          model: '',
          templateValid: true,
          modelValid: true,
          jsonHighlight: { begin: 1, end: 10 },
          jsonError: {
            title: 'title',
            description: 'description',
            type: 'error'
          },
          dispatch: jest.fn()
        }}
      >
        <JSONEditor />
      </EditorContext.Provider>
    )

    unmount()
  })
})
