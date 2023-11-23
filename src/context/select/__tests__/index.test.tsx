import { render } from '@testing-library/react'
import SelectProvider, {
  initialState,
  actionTypes,
  SelectContext,
  selectReducer,
  ISelectState
} from '..'

describe('context', () => {
  test('actionTypes', () => {
    expect(actionTypes.ENABLE).toBeDefined()
    expect(actionTypes.DISABLE).toBeDefined()
    expect(actionTypes.CLEAR).toBeDefined()
    expect(actionTypes.SETTYPE).toBeDefined()
    expect(actionTypes.SETPART).toBeDefined()
    expect(actionTypes.HIGHLIGHT).toBeDefined()
    expect(actionTypes.SELECT).toBeDefined()
    expect(actionTypes.SETPOINT).toBeDefined()
  })

  test('SelectContext', () => {
    expect(SelectContext).toBeDefined()
  })

  test('selectReducer', () => {
    let res: ISelectState

    initialState.dispatch({ type: actionTypes.ENABLE })

    // Enable
    res = selectReducer(initialState, { type: actionTypes.ENABLE })
    expect(res.enabled).toBe(true)

    // Disable
    res = selectReducer(initialState, { type: actionTypes.DISABLE })
    expect(res.enabled).toBe(false)

    // Clear
    res = selectReducer(initialState, { type: actionTypes.CLEAR })
    expect(res).toEqual(initialState)

    // Set type
    res = selectReducer(initialState, {
      type: actionTypes.SETTYPE,
      value: 'faces'
    })
    expect(res.type).toBe('faces')

    // Set part
    res = selectReducer(initialState, {
      type: actionTypes.SETPART,
      value: 'uuid'
    })
    expect(res.part).toBe('uuid')

    // Highlight
    res = selectReducer(initialState, {
      type: actionTypes.HIGHLIGHT,
      value: { uuid: 'uuid', label: 1 }
    })
    expect(res.highlighted).toEqual({ uuid: 'uuid', label: 1 })

    // Select
    res = selectReducer(initialState, {
      type: actionTypes.SELECT,
      value: [{ uuid: 'uuid', label: 2 }]
    })
    expect(res.selected).toEqual([{ uuid: 'uuid', label: 2 }])

    // Set point
    res = selectReducer(initialState, {
      type: actionTypes.SETPOINT,
      value: { x: 0, y: 1, z: 2 }
    })
    expect(res.point).toEqual({ x: 0, y: 1, z: 2 })

    res = selectReducer(initialState, {
      type: actionTypes.SETPOINT,
      value: undefined
    })
    expect(res.point).toEqual(undefined)

    // Set data
    res = selectReducer(initialState, {
      type: actionTypes.SETDATA,
      value: true
    })
    expect(res.data).toEqual(true)

    // Set post processing
    res = selectReducer(initialState, {
      type: actionTypes.SETPOSTPROCESSING,
      value: true
    })
    expect(res.postProcessing).toEqual(true)

    // Default
    res = selectReducer(initialState, { type: 'unknown' })
    expect(res).toEqual(initialState)
  })

  test('SelectProvider', () => {
    const { unmount } = render(
      <SelectProvider>
        <div />
      </SelectProvider>
    )

    unmount()
  })
})
