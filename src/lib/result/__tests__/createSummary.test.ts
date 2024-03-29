import { ISimulation } from '@/database/simulation'

import { HPCClientPlugin } from '@/plugins/index.d'

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
  const simulation = {
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
  } as ISimulation<('name' | 'scheme')[]>

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
    //@ts-ignore
    simulation.scheme.configuration = {
      geometry: {
        index: 1,
        title: 'Geometry',
        children: [
          {
            label: 'Domain',
            data: { file: 'file' }
          }
        ]
      },
      materials: {
        index: 2,
        title: 'Materials',
        children: [],
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
            geometry: 'id',
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
              htmlEntity: 'formula',
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
              htmlEntity: 'formula',
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
              geometry: 'id',
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
              geometry: 'id',
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
        } as HPCClientPlugin
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

  test('without materials & cloud server', () => {
    //@ts-ignore
    simulation.scheme.configuration = {
      geometry: {
        index: 1,
        title: 'Geometry',
        children: [
          {
            label: 'Domain',
            data: { file: 'file' }
          }
        ]
      },
      materials: undefined,
      parameters: {
        index: 3,
        title: 'Parameters',
        parameter: {
          label: 'label',
          children: [
            {
              label: 'label',
              htmlEntity: 'formula',
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
              htmlEntity: 'formula',
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
              geometry: 'id',
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
              geometry: 'id',
              selected: []
            }
          ]
        }
      },
      run: {
        index: 5,
        title: 'Run'
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
