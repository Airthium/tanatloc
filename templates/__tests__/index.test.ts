import Templates from '..'

describe('templates', () => {
  test('import', () => {
    expect(Templates.gmsh3D).toBeDefined()
    expect(Templates.poisson).toBeDefined()
    expect(Templates.linearElasticity).toBeDefined()
    expect(Templates.linearElasticityTime).toBeDefined()
    expect(Templates.stokes).toBeDefined()
    expect(Templates.navierStokesTime).toBeDefined()
    expect(Templates.thermicDiffusion).toBeDefined()
  })
})
