import Local from '..'

jest.mock('../src/lib', () => ({}))

describe('plugins/local', () => {
  test('call', () => {
    expect(Local).toEqual({
      category: 'HPC',
      key: 'local',
      client: {
        name: 'Local',
        description: `<div>
  <p>
    The default configuration, without Gmsh path and FreeFEM path, uses the tanatloc/worker Docker.
  </p>
  <p>
    If you want to use a custom Gmsh, installed in your machine, you can set Gmsh path, i.e. <code>/usr/bin/gmsh</code>
  </p>
  <p>
    If you want to use a custom FreeFEM, installed in your machine, you can set FreeFEM path, i.e. <code>/usr/bin/FreeFem++-mpi</code>
  </p>
</div>`,
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
