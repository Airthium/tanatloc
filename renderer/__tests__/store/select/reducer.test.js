import reducer, {
  selectActionTypes,
  selectInitialState
} from '../../../store/select/reducer'

jest.mock('../../../store/select/action', () => ({
  selectActionTypes: {
    HIGHLIGHT: 'HIGHLIGHT',
    UNHIGHLIGHT: 'UNHIGHLIGHT',
    SELECT: 'SELECT',
    UNSELECT: 'UNSELECT'
  }
}))

describe('renderer/store/select/reducer', () => {
  it('initial state', () => {
    expect(selectInitialState).toEqual({
      highlighted: {},
      previouslyHighlighted: {},
      selected: []
    })
  })

  it('no state', () => {
    const res = reducer(undefined, {})
    expect(res).toEqual(selectInitialState)
  })

  it('highlight', () => {
    const res = reducer(selectInitialState, {
      type: 'HIGHLIGHT',
      part: { uuid: 'id' }
    })
    expect(res).toEqual({
      highlighted: { uuid: 'id' },
      previouslyHighlighted: {},
      selected: []
    })
  })

  it('unhighlight', () => {
    const res = reducer(
      { ...selectInitialState, highlighted: { uuid: 'id' } },
      { type: 'UNHIGHLIGHT' }
    )
    expect(res).toEqual({
      highlighted: {},
      previouslyHighlighted: { uuid: 'id' },
      selected: []
    })
  })

  it('select', () => {
    const res = reducer(selectInitialState, {
      type: 'SELECT',
      part: { uuid: 'id' }
    })
    expect(res).toEqual({
      highlighted: {},
      previouslyHighlighted: {},
      selected: [{ uuid: 'id' }]
    })
  })

  it('unselect', () => {
    let res = reducer(
      { ...selectInitialState, selected: [{ uuid: 'id' }] },
      {
        type: 'UNSELECT',
        part: { uuid: 'id' }
      }
    )
    expect(res).toEqual({
      highlighted: {},
      previouslyHighlighted: {},
      selected: []
    })

    res = reducer(
      { ...selectInitialState, selected: [{ uuid: 'id' }] },
      {
        type: 'UNSELECT',
        part: { uuid: 'id2' }
      }
    )
    expect(res).toEqual({
      highlighted: {},
      previouslyHighlighted: {},
      selected: [{ uuid: 'id' }]
    })
  })
})
