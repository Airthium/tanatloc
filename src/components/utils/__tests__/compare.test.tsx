import { arrayCompare } from '../compare'

describe('src/components/utils/compare', () => {
  test('all undefined', () => {
    const res = arrayCompare()
    expect(res).toBe(false)
  })

  test('one undefined', () => {
    const res = arrayCompare([])
    expect(res).toBe(false)
  })

  test('not undefined', () => {
    const res = arrayCompare([], [])
    expect(res).toBe(true)
  })

  test('length', () => {
    const res = arrayCompare([], [{}])
    expect(res).toBe(false)
  })

  test('object', () => {
    const res = arrayCompare([{ value: true }], [{ value: true }])
    expect(res).toBe(true)
  })

  test('null', () => {
    const res = arrayCompare([null], [null])
    expect(res).toBe(true)
  })

  test('undefined', () => {
    const res = arrayCompare([undefined], [undefined])
    expect(res).toBe(true)
  })

  test('null', () => {
    const res = arrayCompare([[1]], [[2]])
    expect(res).toBe(false)
  })
})
