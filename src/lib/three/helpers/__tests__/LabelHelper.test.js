import LabelHelper from '../LabelHelper'

document.createElement = () => ({
  getContext: () => ({
    fillText: () => {}
  })
})

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
