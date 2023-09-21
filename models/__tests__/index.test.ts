import models from '..'

jest.mock('../description/linearElasticity', () => 'description')
jest.mock('../description/linearElasticityModal', () => 'description')
jest.mock('../description/linearElasticityTime', () => 'description')
jest.mock('../description/magnetostatic', () => 'description')
jest.mock('../description/navierStokesTime', () => 'description')
jest.mock('../description/poisson', () => 'description')
jest.mock('../description/stokes', () => 'description')
jest.mock('../description/thermicDiffusion', () => 'description')

describe('models', () => {
  test('length', () => {
    expect(models.length).toBe(9)
  })
})
