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
  it('action types', () => {
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

  it('enable', () => {
    const res = enable()
    expect(res).toEqual({
      type: selectActionTypes.ENABLE
    })
  })

  it('disable', () => {
    const res = disable()
    expect(res).toEqual({
      type: selectActionTypes.DISABLE
    })
  })

  it('clear', () => {
    const res = clear()
    expect(res).toEqual({
      type: selectActionTypes.CLEAR
    })
  })

  it('setType', () => {
    const res = setType('type')
    expect(res).toEqual({
      type: selectActionTypes.SETTYPE,
      object: 'type'
    })
  })

  it('setPart', () => {
    const res = setPart('uuid')
    expect(res).toEqual({
      type: selectActionTypes.SETPART,
      uuid: 'uuid'
    })
  })

  it('highlight', () => {
    const res = highlight('id')
    expect(res).toEqual({
      type: selectActionTypes.HIGHLIGHT,
      uuid: 'id'
    })
  })

  it('unhighlight', () => {
    const res = unhighlight()
    expect(res).toEqual({
      type: selectActionTypes.UNHIGHLIGHT
    })
  })

  it('select', () => {
    const res = select('id')
    expect(res).toEqual({
      type: selectActionTypes.SELECT,
      uuid: 'id'
    })
  })

  it('unselect', () => {
    const res = unselect('id')
    expect(res).toEqual({
      type: selectActionTypes.UNSELECT,
      uuid: 'id'
    })
  })
})
