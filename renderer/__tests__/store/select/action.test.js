import {
  selectActionTypes,
  highlight,
  unhighlight,
  select,
  unselect
} from '../../../store/select/action'

describe('renderer/store/select/action', () => {
  it('action types', () => {
    expect(selectActionTypes.HIGHLIGHT).toBe('HIGHLIGHT')
    expect(selectActionTypes.UNHIGHLIGHT).toBe('UNHIGHLIGHT')
    expect(selectActionTypes.SELECT).toBe('SELECT')
    expect(selectActionTypes.UNSELECT).toBe('UNSELECT')
  })

  it('highlight', () => {
    const res = highlight({ id: 'id' })
    expect(res).toEqual({
      type: selectActionTypes.HIGHLIGHT,
      part: {
        id: 'id'
      }
    })
  })

  it('unhighlight', () => {
    const res = unhighlight()
    expect(res).toEqual({
      type: selectActionTypes.UNHIGHLIGHT
    })
  })

  it('select', () => {
    const res = select({ id: 'id' })
    expect(res).toEqual({
      type: selectActionTypes.SELECT,
      part: {
        id: 'id'
      }
    })
  })

  it('unselect', () => {
    const res = unselect({ id: 'id' })
    expect(res).toEqual({
      type: selectActionTypes.UNSELECT,
      part: {
        id: 'id'
      }
    })
  })
})
