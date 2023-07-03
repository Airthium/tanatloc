import { actionTypes } from '..'
import { addError, addSuccess, removeError, removeSuccess } from '../actions'

describe('context/notification/actions', () => {
  test('addSuccess', () => {
    const res = addSuccess({ title: 'title', description: 'description' })
    expect(res).toEqual({
      type: actionTypes.ADDSUCCESS,
      value: { title: 'title', description: 'description' }
    })
  })

  test('removeSuccess', () => {
    const res = removeSuccess({ title: 'title', description: 'description' })
    expect(res).toEqual({
      type: actionTypes.REMOVESUCCESS,
      value: { title: 'title', description: 'description' }
    })
  })

  test('addError', () => {
    const res = addError({ title: 'title', err: new Error('error') })
    expect(res).toEqual({
      type: actionTypes.ADDERROR,
      value: { title: 'title', err: new Error('error') }
    })
  })

  test('removeError', () => {
    const res = removeError({ title: 'title', err: new Error('error') })
    expect(res).toEqual({
      type: actionTypes.REMOVEERROR,
      value: { title: 'title', err: new Error('error') }
    })
  })
})
