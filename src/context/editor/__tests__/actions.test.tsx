import { actionTypes } from '..'
import {
  setId,
  setJsonCursor,
  setTemplateCursor,
  setModel,
  setModelValid,
  setTemplate,
  setTemplateValid,
  setJsonHighlight,
  setJsonError,
  setTemplateError,
  setTemplateHighlight
} from '../actions'

describe('context/editor/actions', () => {
  test('setId', () => {
    const res = setId('id')
    expect(res).toEqual({ type: actionTypes.SETID, value: 'id' })
  })

  test('setTemplate', () => {
    const res = setTemplate('template')
    expect(res).toEqual({ type: actionTypes.SETTEMPLATE, value: 'template' })
  })

  test('setModel', () => {
    const res = setModel('model')
    expect(res).toEqual({ type: actionTypes.SETMODEL, value: 'model' })
  })

  test('setJsonHighlight', () => {
    const res = setJsonHighlight({ begin: 1, end: 2 })
    expect(res).toEqual({
      type: actionTypes.SETJSONHIGHLIGHT,
      value: { begin: 1, end: 2 }
    })
  })

  test('setTemplateHighlight', () => {
    const res = setTemplateHighlight({ begin: 1, end: 2 })
    expect(res).toEqual({
      type: actionTypes.SETTEMPLATEHIGHLIGHT,
      value: { begin: 1, end: 2 }
    })
  })

  test('setJsonCursor', () => {
    const res = setJsonCursor({ row: 1, column: 2 })
    expect(res).toEqual({
      type: actionTypes.SETJSONCURSOR,
      value: { row: 1, column: 2 }
    })
  })

  test('setTemplateCursor', () => {
    const res = setTemplateCursor({ row: 1, column: 2 })
    expect(res).toEqual({
      type: actionTypes.SETTEMPLATECURSOR,
      value: { row: 1, column: 2 }
    })
  })

  test('setJsonError', () => {
    const res = setJsonError({
      title: 'title',
      description: 'description',
      type: 'error',
      row: 1,
      column: 2
    })
    expect(res).toEqual({
      type: actionTypes.SETJSONERROR,
      value: {
        title: 'title',
        description: 'description',
        type: 'error',
        row: 1,
        column: 2
      }
    })
  })

  test('setTemplateError', () => {
    const res = setTemplateError({
      title: 'title',
      description: 'description',
      type: 'error',
      row: 1,
      column: 2
    })
    expect(res).toEqual({
      type: actionTypes.SETTEMPLATEERROR,
      value: {
        title: 'title',
        description: 'description',
        type: 'error',
        row: 1,
        column: 2
      }
    })
  })

  test('setTemplateValid', () => {
    const res = setTemplateValid(true)
    expect(res).toEqual({ type: actionTypes.SETTEMPLATEVALID, value: true })
  })

  test('setModelValid', () => {
    const res = setModelValid(true)
    expect(res).toEqual({ type: actionTypes.SETMODELVALID, value: true })
  })
})
