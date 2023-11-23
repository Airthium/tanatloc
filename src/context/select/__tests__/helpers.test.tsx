import {
  addOrRemoveSelection,
  addSelections,
  removeSelections,
  swapSelections
} from '../helpers'

describe('context/select/helpers', () => {
  test('addOrRemoveSelection', () => {
    let res = addOrRemoveSelection([], { uuid: 'uuid', label: 1 })
    expect(res).toEqual([{ uuid: 'uuid', label: 1 }])

    res = addOrRemoveSelection([{ uuid: 'uuid', label: 1 }], {
      uuid: 'uuid',
      label: 1
    })
    expect(res).toEqual([])
  })

  test('addSelections', () => {
    let res = addSelections([], [{ uuid: 'uuid', label: 1 }])
    expect(res).toEqual([{ uuid: 'uuid', label: 1 }])

    res = addSelections(
      [{ uuid: 'uuid', label: 1 }],
      [{ uuid: 'uuid', label: 1 }]
    )
    expect(res).toEqual([{ uuid: 'uuid', label: 1 }])
  })

  test('removeSelections', () => {
    let res = removeSelections([], [{ uuid: 'uuid', label: 1 }])
    expect(res).toEqual([])

    res = removeSelections(
      [{ uuid: 'uuid', label: 1 }],
      [{ uuid: 'uuid', label: 1 }]
    )
    expect(res).toEqual([])
  })

  test('swapSelections', () => {
    const res = swapSelections(
      [{ uuid: 'uuid', label: 1 }],
      [
        { uuid: 'uuid', label: 1 },
        { uuid: 'uuid2', label: 2 }
      ]
    )
    expect(res).toEqual([{ uuid: 'uuid2', label: 2 }])
  })
})
