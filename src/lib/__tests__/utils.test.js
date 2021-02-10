import Utils from '../utils'

describe('src/lib/utils', () => {
  it('stringToColor', () => {
    const color = Utils.stringToColor('string')
    expect(color).toBe('#D56011')
  })
})
