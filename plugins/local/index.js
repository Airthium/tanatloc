/** @namespace Plugins.Local */

import Lib from './src/lib'

/**
 * Local plugin definition
 * @memberof Plugins.Local
 */
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
