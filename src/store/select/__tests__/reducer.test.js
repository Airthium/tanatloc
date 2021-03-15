import reducer, { selectInitialState } from '@/store/select/reducer'

jest.mock('@/store/select/action', () => ({
  selectActionTypes: {
    ENABLE: 'ENABLE',
    DISABLE: 'DISABLE',
    CLEAR: 'CLEAR',
    SETTYPE: 'SETTYPE',
    SETPART: 'SETPART',
    HIGHLIGHT: 'HIGHLIGHT',
    UNHIGHLIGHT: 'UNHIGHLIGHT',
    SELECT: 'SELECT',
    UNSELECT: 'UNSELECT'
  }
}))

describe('store/select/reducer', () => {
  it('initial state', () => {
    expect(selectInitialState).toEqual({
      enabled: false,
      type: null,
      part: null,
      highlighted: null,
      selected: []
    })
  })

  it('no state', () => {
    const res = reducer(undefined, {})
    expect(res).toEqual(selectInitialState)
  })

  it('enable', () => {
    const res = reducer(selectInitialState, { type: 'ENABLE' })
    expect(res).toEqual({
      ...selectInitialState,
      enabled: true
    })
  })

  it('disable', () => {
    const res = reducer(
      { ...selectInitialState, enabled: true },
      { type: 'DISABLE' }
    )
    expect(res).toEqual(selectInitialState)
  })

  it('clear', () => {
    const res = reducer({}, { type: 'CLEAR' })
    expect(res).toEqual(selectInitialState)
  })

  it('setType', () => {
    const res = reducer(selectInitialState, { type: 'SETTYPE', object: 'face' })
    expect(res).toEqual({
      ...selectInitialState,
      type: 'face'
    })
  })

  it('setPart', () => {
    const res = reducer(selectInitialState, { type: 'SETPART', uuid: 'uuid' })
    expect(res).toEqual({
      ...selectInitialState,
      part: 'uuid'
    })
  })

  it('highlight', () => {
    const res = reducer(selectInitialState, {
      type: 'HIGHLIGHT',
      uuid: 'uuid'
    })
    expect(res).toEqual({
      ...selectInitialState,
      highlighted: 'uuid'
    })
  })

  it('unhighlight', () => {
    const res = reducer(
      { ...selectInitialState, highlighted: 'uuid' },
      { type: 'UNHIGHLIGHT' }
    )
    expect(res).toEqual({
      ...selectInitialState,
      highlighted: null
    })
  })

  it('select', () => {
    const res = reducer(selectInitialState, {
      type: 'SELECT',
      uuid: 'uuid'
    })
    expect(res).toEqual({
      ...selectInitialState,
      selected: ['uuid']
    })
  })

  it('unselect', () => {
    let res = reducer(
      { ...selectInitialState, selected: ['uuid'] },
      {
        type: 'UNSELECT',
        uuid: 'uuid'
      }
    )
    expect(res).toEqual(selectInitialState)

    res = reducer(
      { ...selectInitialState, selected: ['uuid'] },
      {
        type: 'UNSELECT',
        uuid: 'uuid2'
      }
    )
    expect(res).toEqual({
      ...selectInitialState,
      selected: ['uuid']
    })
  })
})
