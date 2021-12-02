import Simulation from '..'

jest.mock('../useSimulations', () => ({
  useSimulations: jest.fn
}))

jest.mock('../useSimulation', () => ({
  useSimulation: jest.fn
}))

jest.mock('../add', () => ({
  add: jest.fn
}))

jest.mock('../update', () => ({
  update: jest.fn
}))

jest.mock('../del', () => ({
  del: jest.fn
}))

jest.mock('../run', () => ({
  run: jest.fn
}))

jest.mock('../stop', () => ({
  stop: jest.fn
}))

jest.mock('../tasks', () => ({
  tasks: jest.fn
}))

jest.mock('../log', () => ({
  log: jest.fn
}))

describe('api/simulation', () => {
  test('import', () => {
    expect(Simulation.useSimulations).toBeDefined()
    expect(Simulation.useSimulation).toBeDefined()
    expect(Simulation.add).toBeDefined()
    expect(Simulation.update).toBeDefined()
    expect(Simulation.del).toBeDefined()
    expect(Simulation.run).toBeDefined()
    expect(Simulation.stop).toBeDefined()
    expect(Simulation.tasks).toBeDefined()
    expect(Simulation.log).toBeDefined()
  })
})
