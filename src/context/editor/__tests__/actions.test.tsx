import { actionTypes } from '..'
import {
  setCursor,
  setModel,
  setModelValid,
  setTemplate,
  setTemplateValid
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

  test('setCursor', () => {
    const res = setCursor({ row: 1, column: 2 })
    expect(res).toEqual({
      type: actionTypes.SETCURSOR,
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
