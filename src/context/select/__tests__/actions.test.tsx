import { actionTypes } from '..'
import {
  enable,
  disable,
  clear,
  setType,
  setPart,
  highlight,
  select,
  setData,
  setPostProcessing,
  setPoint
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
    const part = 'uuid'
    const res = setPart(part)
    expect(res).toEqual({ type: actionTypes.SETPART, value: 'uuid' })
  })

  test('highlight', () => {
    const res = highlight({ uuid: 'uuid', label: 1 })
    expect(res).toEqual({
      type: actionTypes.HIGHLIGHT,
      value: { uuid: 'uuid', label: 1 }
    })
  })

  test('select', () => {
    const res = select([{ uuid: 'uuid', label: 1 }])
    expect(res).toEqual({
      type: actionTypes.SELECT,
      value: [{ uuid: 'uuid', label: 1 }]
    })
  })

  test('setPoint', () => {
    const point = { x: 0, y: 1, z: 2 }
    const res = setPoint(point)
    expect(res).toEqual({ type: actionTypes.SETPOINT, value: point })
  })

  test('setData', () => {
    const data = true
    const res = setData(data)
    expect(res).toEqual({ type: actionTypes.SETDATA, value: data })
  })

  test('setPostProcessing', () => {
    const postProcessing = true
    const res = setPostProcessing(postProcessing)
    expect(res).toEqual({
      type: actionTypes.SETPOSTPROCESSING,
      value: postProcessing
    })
  })
})
