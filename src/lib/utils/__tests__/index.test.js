import Utils from '../'

describe('lib/utils', () => {
  it('stringToColor', () => {
    const color = Utils.stringToColor('string')
    expect(color).toBe('#D56011')
  })

  it('rgbToHex', () => {
    const hex = Utils.rgbToHex([0, 1, 1])
    expect(hex).toBe('#00ffff')
  })

  it('rgbToRgba', () => {
    let rgba = Utils.rgbToRgba([0, 1, 1], 0.1)
    expect(rgba).toBe('rgba(0, 255, 255, 0.1)')

    rgba = Utils.rgbToRgba()
    expect(rgba).toBe('rgba(255, 255, 255, 0)')
  })
})
