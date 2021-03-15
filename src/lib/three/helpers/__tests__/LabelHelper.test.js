import LabelHelper from '../LabelHelper'

document.createElement = () => ({
  getContext: () => ({
    fillText: () => {}
  })
})

describe('lib/three/helpers/LabelHelper', () => {
  it('call', () => {
    const label = LabelHelper('text')
    expect(label).toBeDefined()
  })

  it('dispose', () => {
    const label = LabelHelper('text')
    label.dispose()
  })
})
