import linearElasticity from '../linearElasticity'
import linearElasticityModal from '../linearElasticityModal'
import linearElasticityTime from '../linearElasticityTime'
import magnetostatic from '../magnetostatic'
import magnetostatic2Bodies from '../magnetostatic2Bodies'
import navierStokesTime from '../navierStokesTime'
import poisson from '../poisson'
import stokes from '../stokes'
import thermicDiffusion from '../thermicDiffusion'

jest.mock('react-dom/server', () => ({
  renderToString: () => 'string'
}))

describe('models/description', () => {
  test('defined', () => {
    expect(linearElasticity).toBeDefined()
    expect(linearElasticityModal).toBeDefined()
    expect(linearElasticityTime).toBeDefined()
    expect(magnetostatic).toBeDefined()
    expect(magnetostatic2Bodies).toBeDefined()
    expect(navierStokesTime).toBeDefined()
    expect(poisson).toBeDefined()
    expect(stokes).toBeDefined()
    expect(thermicDiffusion).toBeDefined()
  })
})
