import {
  selectActionTypes,
  enable,
  disable,
  clear,
  setType,
  setPart,
  highlight,
  unhighlight,
  select,
  unselect
} from '@/store/select/action'

describe('store/select/action', () => {
  test('action types', () => {
    expect(selectActionTypes.ENABLE).toBe('ENABLE')
    expect(selectActionTypes.DISABLE).toBe('DISABLE')
    expect(selectActionTypes.CLEAR).toBe('CLEAR')
    expect(selectActionTypes.SETTYPE).toBe('SETTYPE')
    expect(selectActionTypes.SETPART).toBe('SETPART')
    expect(selectActionTypes.HIGHLIGHT).toBe('HIGHLIGHT')
    expect(selectActionTypes.UNHIGHLIGHT).toBe('UNHIGHLIGHT')
    expect(selectActionTypes.SELECT).toBe('SELECT')
    expect(selectActionTypes.UNSELECT).toBe('UNSELECT')
  })

  test('enable', () => {
    const res = enable()
    expect(res).toEqual({
      type: selectActionTypes.ENABLE
    })
  })

  test('disable', () => {
    const res = disable()
    expect(res).toEqual({
      type: selectActionTypes.DISABLE
    })
  })

  test('clear', () => {
    const res = clear()
    expect(res).toEqual({
      type: selectActionTypes.CLEAR
    })
  })

  test('setType', () => {
    const res = setType('type')
    expect(res).toEqual({
      type: selectActionTypes.SETTYPE,
      object: 'type'
    })
  })

  test('setPart', () => {
    const res = setPart('uuid')
    expect(res).toEqual({
      type: selectActionTypes.SETPART,
      uuid: 'uuid'
    })
  })

  test('highlight', () => {
    const res = highlight('id')
    expect(res).toEqual({
      type: selectActionTypes.HIGHLIGHT,
      uuid: 'id'
    })
  })

  test('unhighlight', () => {
    const res = unhighlight()
    expect(res).toEqual({
      type: selectActionTypes.UNHIGHLIGHT
    })
  })

  test('select', () => {
    const res = select('id')
    expect(res).toEqual({
      type: selectActionTypes.SELECT,
      uuid: 'id'
    })
  })

  test('unselect', () => {
    const res = unselect('id')
    expect(res).toEqual({
      type: selectActionTypes.UNSELECT,
      uuid: 'id'
    })
  })
})
