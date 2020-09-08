import LabelHelper from '../LabelHelper'

document.createElement = () => ({
  getContext: () => ({
    fillText: () => {}
  })
})

describe('src/lib/three/helpers/LabelHelper', () => {
  it('call', () => {
    const label = LabelHelper('text')
    expect(label).toBeDefined()
  })
})
