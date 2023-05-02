import { actionTypes } from '..'
import {
  setJsonCursor,
  setTemplateCursor,
  setModel,
  setModelValid,
  setTemplate,
  setTemplateValid,
  setJsonHighlight,
  setTemplateHighlight
} from '../actions'

describe('context/editor/actions', () => {
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

  test('setTemplateValid', () => {
    const res = setTemplateValid(true)
    expect(res).toEqual({ type: actionTypes.SETTEMPLATEVALID, value: true })
  })

  test('setModelValid', () => {
    const res = setModelValid(true)
    expect(res).toEqual({ type: actionTypes.SETMODELVALID, value: true })
  })
})
