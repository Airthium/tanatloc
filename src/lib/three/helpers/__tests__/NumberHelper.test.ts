import NumberHelper from '../NumberHelper'

describe('lib/three/helpers/NumberHelper', () => {
  test('0', () => {
    const number = NumberHelper(-1e-13)
    expect(number).toBe('0')
  })

  test('1.1', () => {
    const number = NumberHelper(1.1)
    expect(number).toBe('1.100')
  })

  test('11111111', () => {
    const number = NumberHelper(11111111)
    expect(number).toBe('1.11e+7')
  })
})
