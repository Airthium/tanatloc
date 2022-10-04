import { render } from '@testing-library/react'

import EditorProvider, { editorReducer, initialState } from '..'

describe('context/editor', () => {
  test('render', () => {
    const { unmount } = render(<EditorProvider>children</EditorProvider>)

    unmount()
  })

  test('reducer', () => {
    const state = initialState
    let newState

    newState = editorReducer(state, { type: 'SETTEMPLATE', value: 'template' })
    expect(newState.template).toBe('template')

    newState = editorReducer(state, { type: 'SETMODEL', value: 'model' })
    expect(newState.model).toBe('model')

    newState = editorReducer(state, {
      type: 'SETCURSOR',
      value: { row: 1, column: 2 }
    })
    expect(newState.cursor).toEqual({ row: 1, column: 2 })

    newState = editorReducer(state, { type: 'SETTEMPLATEVALID', value: true })
    expect(newState.templateValid).toBe(true)

    newState = editorReducer(state, { type: 'SETMODELVALID', value: true })
    expect(newState.modelValid).toBe(true)
  })
})
