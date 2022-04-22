import { ISimulation } from '@/database/simulation'

import createPVD from '../createPVD'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

jest.mock('@/config/storage', () => ({
  SIMULATION: 'simulation'
}))

const mockWriteStream = jest.fn()
jest.mock('../../tools', () => ({
  writeStream: () => mockWriteStream()
}))

describe('lib/download/pvd', () => {
  const simulation = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      description: 'description',
      code: 'code',
      algorithm: 'algorithm',
      version: 'version',
      configuration: {
        run: {
          index: 1,
          title: 'Run'
        }
      }
    }
  } as ISimulation<('name' | 'scheme')[]>
  const files = ['result_1.vtu', 'result_2.vtu']

  beforeEach(() => {
    mockPath.mockReset()
    mockPath.mockImplementation(() => 'path')

    mockWriteStream.mockReset()
    mockWriteStream.mockImplementation(() => ({
      write: jest.fn(),
      end: jest.fn()
    }))
  })

  test('call', () => {
    const pvds = createPVD(simulation, files)
    expect(pvds).toEqual([])
  })

  test('full', () => {
    //@ts-ignore
    simulation.scheme.configuration = {
      run: {
        index: 2,
        title: 'Run',
        resultsFilter: {
          name: 'Name',
          prefixPattern: 'result_',
          suffixPattern: '.vtu',
          pattern: 'result_\\d+.vtu',
          multiplicator: ['parameters', 'time', 'children', '1']
        }
      },
      parameters: {
        index: 1,
        title: 'Parameters',
        time: {
          label: 'Time',
          children: [
            {
              label: 'label',
              htmlEntity: 'entity',
              default: 0
            },
            { label: 'label', htmlEntity: 'entity', default: 0.1 }
          ]
        }
      }
    }
    let pvds = createPVD(simulation, files)
    expect(pvds).toEqual([{ name: 'Name.pvd', path: 'path' }])

    // Without multiplicator
    //@ts-ignore
    delete simulation.scheme.configuration.run.resultsFilter.multiplicator
    pvds = createPVD(simulation, files)
    expect(pvds).toEqual([{ name: 'Name.pvd', path: 'path' }])
  })

  test('no filtered files', () => {
    //@ts-ignore
    simulation.scheme.configuration = {
      run: {
        index: 2,
        title: 'Run',
        resultsFilter: {
          name: 'Name',
          prefixPattern: 'Result_',
          suffixPattern: '.vtu',
          pattern: 'Result_\\d+.vtu',
          multiplicator: ['parameters', 'time', 'children', '1']
        }
      },
      parameters: {
        index: 1,
        title: 'Parameters',
        time: {
          label: 'Time',
          children: [
            {
              label: 'label',
              htmlEntity: 'entity',
              default: 0
            },
            { label: 'label', htmlEntity: 'entity', default: 0.1 }
          ]
        }
      }
    }
    const pvds = createPVD(simulation, files)
    expect(pvds).toEqual([])
  })
})
