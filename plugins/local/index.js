import path from 'path'
import Lib from './src/lib'

const Local = {
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
    lib: Lib
  }
}

export default Local
