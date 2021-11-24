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
  test('initial state', () => {
    expect(selectInitialState).toEqual({
      enabled: false,
      type: null,
      part: null,
      highlighted: null,
      selected: []
    })
  })

  test('no state', () => {
    const res = reducer(undefined, { type: 'tpye' })
    expect(res).toEqual(selectInitialState)
  })

  test('enable', () => {
    const res = reducer(selectInitialState, { type: 'ENABLE' })
    expect(res).toEqual({
      ...selectInitialState,
      enabled: true
    })
  })

  test('disable', () => {
    const res = reducer(
      { ...selectInitialState, enabled: true },
      { type: 'DISABLE' }
    )
    expect(res).toEqual(selectInitialState)
  })

  test('clear', () => {
    const res = reducer({ enabled: true, selected: [] }, { type: 'CLEAR' })
    expect(res).toEqual(selectInitialState)
  })

  test('setType', () => {
    const res = reducer(selectInitialState, { type: 'SETTYPE', object: 'face' })
    expect(res).toEqual({
      ...selectInitialState,
      type: 'face'
    })
  })

  test('setPart', () => {
    const res = reducer(selectInitialState, { type: 'SETPART', uuid: 'uuid' })
    expect(res).toEqual({
      ...selectInitialState,
      part: 'uuid'
    })
  })

  test('highlight', () => {
    const res = reducer(selectInitialState, {
      type: 'HIGHLIGHT',
      uuid: 'uuid'
    })
    expect(res).toEqual({
      ...selectInitialState,
      highlighted: 'uuid'
    })
  })

  test('unhighlight', () => {
    const res = reducer(
      { ...selectInitialState, highlighted: 'uuid' },
      { type: 'UNHIGHLIGHT' }
    )
    expect(res).toEqual({
      ...selectInitialState,
      highlighted: null
    })
  })

  test('select', () => {
    const res = reducer(selectInitialState, {
      type: 'SELECT',
      uuid: 'uuid'
    })
    expect(res).toEqual({
      ...selectInitialState,
      selected: ['uuid']
    })
  })

  test('unselect', () => {
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
