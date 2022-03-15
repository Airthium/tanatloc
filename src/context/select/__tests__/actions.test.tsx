import { actionTypes } from '..'
import {
  enable,
  disable,
  clear,
  setType,
  setPart,
  highlight,
  unhighlight,
  select,
  unselect
} from '../actions'

describe('context/select', () => {
  test('enable', () => {
    const res = enable()
    expect(res).toEqual({ type: actionTypes.ENABLE })
  })

  test('disable', () => {
    const res = disable()
    expect(res).toEqual({ type: actionTypes.DISABLE })
  })

  test('clear', () => {
    const res = clear()
    expect(res).toEqual({ type: actionTypes.CLEAR })
  })

  test('setType', () => {
    const res = setType('solids')
    expect(res).toEqual({ type: actionTypes.SETTYPE, value: 'solids' })
  })

  test('setPart', () => {
    const res = setPart('uuid')
    expect(res).toEqual({ type: actionTypes.SETPART, value: 'uuid' })
  })

  test('highlight', () => {
    const res = highlight({ uuid: 'uuid', label: 'label' })
    expect(res).toEqual({
      type: actionTypes.HIGHLIGHT,
      value: { uuid: 'uuid', label: 'label' }
    })
  })

  test('unhighlight', () => {
    const res = unhighlight()
    expect(res).toEqual({ type: actionTypes.UNHIGHLIGHT })
  })

  test('select', () => {
    const res = select({ uuid: 'uuid', label: 'label' })
    expect(res).toEqual({
      type: actionTypes.SELECT,
      value: { uuid: 'uuid', label: 'label' }
    })
  })

  test('unselect', () => {
    const res = unselect({ uuid: 'uuid', label: 'label' })
    expect(res).toEqual({
      type: actionTypes.UNSELECT,
      value: { uuid: 'uuid', label: 'label' }
    })
  })
})
