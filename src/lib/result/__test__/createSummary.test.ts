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
        file: {
          name: 'name'
        }
      },
      materials: {
        values: [
          {
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
            selected: [{ label: 1 }]
          }
        ]
      },
      parameters: {
        index: 0,
        parameter: {
          label: 'label',
          children: [
            {
              label: 'label',
              value: 'value'
            }
          ]
        },
        otherParameter: {
          label: 'label',
          children: [
            {
              label: 'label',
              default: 'default'
            }
          ]
        }
      },
      boundaryConditions: {
        index: 0,
        type: {
          values: [
            {
              name: 'name',
              type: {
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
              selected: [{ label: 1 }]
            }
          ]
        },
        otherType: {},
        otherOtherType: {
          values: [
            {
              name: 'undefined',
              type: {
                label: 'undefined'
              },
              selected: []
            }
          ]
        }
      },
      run: {
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
