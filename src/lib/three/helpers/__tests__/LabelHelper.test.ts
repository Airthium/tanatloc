import LabelHelper from '../LabelHelper'

document.createElement = jest.fn().mockImplementation(() => ({
  getContext: () => ({
    fillText: jest.fn
  })
}))

describe('lib/three/helpers/LabelHelper', () => {
  test('call', () => {
    const label = LabelHelper('text')
    expect(label).toBeDefined()
  })

  test('dispose', () => {
    const label = LabelHelper('text')
    label.dispose()
  })
})
