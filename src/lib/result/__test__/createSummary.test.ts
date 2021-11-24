import { ISimulation } from '@/database/index.d'

import createSummary from '../createSummary'

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

describe('lib/download/summary', () => {
  const simulation: ISimulation = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      description: 'description',
      code: 'code',
      algorithm: 'algorithm',
      version: 'version',
      configuration: {}
    }
  }

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
    const summary = createSummary(simulation)
    expect(summary).toEqual({
      path: 'path',
      name: 'summary.txt'
    })
  })

  test('full', () => {
    simulation.scheme.configuration = {
      geometry: {
        index: 1,
        title: 'Geometry',
        meshable: true,
        file: 'file'
      },
      materials: {
        index: 2,
        title: 'Materials',
        values: [
          {
            uuid: 'uuid',
            material: {
              label: 'label',
              children: [
                {
                  label: 'label',
                  value: 'value',
                  symbol: 'symbol'
                }
              ]
            },
            selected: [{ uuid: 'uuid', label: 1 }]
          }
        ]
      },
      parameters: {
        index: 3,
        title: 'Parameters',
        parameter: {
          label: 'label',
          children: [
            {
              label: 'label',
              htmlEntity: 'entity',
              default: 0,
              value: 'value'
            }
          ]
        },
        otherParameter: {
          label: 'label',
          children: [
            {
              label: 'label',
              htmlEntity: 'entity',
              default: 'default'
            }
          ]
        }
      },
      boundaryConditions: {
        index: 0,
        title: 'Boundary conditions',
        type: {
          label: 'label',
          values: [
            {
              uuid: 'uuid',
              name: 'name',
              type: {
                key: 'key',
                label: 'label'
              },
              values: [
                {
                  value: 'value'
                },
                {
                  value: 'value',
                  checked: true
                },
                {
                  value: 'value',
                  checked: false
                }
              ],
              selected: [{ uuid: 'uuid', label: 1 }]
            }
          ]
        },
        otherType: {
          label: 'label'
        },
        otherOtherType: {
          label: 'label',
          values: [
            {
              uuid: 'uuid',
              name: 'undefined',
              type: {
                key: 'undefined',
                label: 'undefined'
              },
              selected: []
            }
          ]
        }
      },
      run: {
        index: 5,
        title: 'Run',
        cloudServer: {
          name: 'name'
        }
      },
      //@ts-ignore
      unknowKey: {}
    }
    const summary = createSummary(simulation)
    expect(summary).toEqual({
      path: 'path',
      name: 'summary.txt'
    })
  })
})
