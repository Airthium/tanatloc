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
            type: 'input',
            rules: [
              { required: true, message: 'Name is required' },
              { max: 50, message: 'Max 50 characters' }
            ]
          },
          gmshPath: {
            label: 'Gmsh path',
            type: 'input',
            tooltip: 'Fill this input to use a local version of Gmsh'
          },
          freefemPath: {
            label: 'FreeFEM path (ff-mpirun)',
            type: 'input',
            tooltip: 'Fill this input to use a local version of FreeFEM'
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
