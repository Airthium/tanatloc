import Local from '..'

jest.mock('../src/lib', () => ({}))

describe('plugins/local', () => {
  test('call', () => {
    expect(Local).toEqual({
      category: 'HPC',
      key: 'local',
      client: {
        name: 'Local',
        description: '<p>Local</p>',
        configuration: {
          name: {
            label: 'Name',
            type: 'input'
          }
        },
        inUseConfiguration: {}
      },
      server: {
        lib: {}
      }
    })
  })
})
