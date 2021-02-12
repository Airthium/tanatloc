import Utils from '../utils'

describe('src/lib/utils', () => {
  it('stringToColor', () => {
    const color = Utils.stringToColor('string')
    expect(color).toBe('#D56011')
  })

  it('rgbToHex', () => {
    const hex = Utils.rgbToHex([0, 1, 1])
    expect(hex).toBe('#00ffff')
  })
})
