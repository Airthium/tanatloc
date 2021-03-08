import createPVD from '../pvd'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

const mockCreateWriteStream = jest.fn()
jest.mock('fs', () => ({
  createWriteStream: () => mockCreateWriteStream()
}))

jest.mock('@/config/storage', () => ({
  SIMULATION: 'simulation'
}))

describe('src/lib/download/pvd', () => {
  const simulation = {
    scheme: {
      configuration: {
        run: {}
      }
    }
  }
  const files = ['result_1.vtu', 'result_2.vtu']

  beforeEach(() => {
    mockPath.mockReset()
    mockPath.mockImplementation(() => 'path')

    mockCreateWriteStream.mockReset()
    mockCreateWriteStream.mockImplementation(() => ({
      write: jest.fn(),
      end: jest.fn()
    }))
  })

  it('call', () => {
    const pvds = createPVD(simulation, files)
    expect(pvds).toEqual([])
  })

  it('full', () => {
    simulation.scheme.configuration = {
      run: {
        resultsFilters: [
          {
            name: 'Name',
            prefixPattern: 'result_',
            suffixPattern: '.vtu',
            pattern: 'result_\\d+.vtu',
            multiplicator: ['parameters', 'time', 'children', '1']
          }
        ]
      },
      parameters: {
        time: {
          children: [{}, { default: 0.1 }]
        }
      }
    }
    const pvds = createPVD(simulation, files)
    expect(pvds).toEqual([{ name: 'Name.pvd', path: 'path' }])
  })

  it('no filtered files', () => {
    simulation.scheme.configuration = {
      run: {
        resultsFilters: [
          {
            name: 'Name',
            prefixPattern: 'Result_',
            suffixPattern: '.vtu',
            pattern: 'Result_\\d+.vtu',
            multiplicator: ['parameters', 'time', 'children', '1']
          }
        ]
      },
      parameters: {
        time: {
          children: [{}, { default: 0.1 }]
        }
      }
    }
    const pvds = createPVD(simulation, files)
    expect(pvds).toEqual([])
  })
})
