import createSummary from '../createSummary'

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

describe('lib/download/summary', () => {
  const simulation = {
    scheme: {
      algorithm: 'algorithm',
      configuration: {}
    }
  }

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
    const summary = createSummary(simulation)
    expect(summary).toEqual({
      path: 'path',
      name: 'summary.txt'
    })
  })

  it('full', () => {
    simulation.scheme.configuration = {
      part: {},
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
      unknowKey: {}
    }
    const summary = createSummary(simulation)
    expect(summary).toEqual({
      path: 'path',
      name: 'summary.txt'
    })
  })
})
