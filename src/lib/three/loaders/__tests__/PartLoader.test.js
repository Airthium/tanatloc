import { PartLoader } from '../PartLoader'

describe('src/lib/three/loaders/PartLoader', () => {
  it('call', () => {
    const partLoader = PartLoader()
    expect(partLoader).toBeDefined()
  })

  it('load', () => {
    const part = {
      solids: [{}]
    }
    const partLoader = PartLoader()
    partLoader.load(part)

    partLoader.load(part, true)
  })
})
