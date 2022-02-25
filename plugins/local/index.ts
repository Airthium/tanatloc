/** @module Plugins.Local */

import { IPlugin } from '@/database/index.d'

import Lib from './src/lib'

/**
 * Local plugin definition
 */
const Local: IPlugin = {
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
      }
    },
    inUseConfiguration: {}
  },
  server: {
    lib: Lib
  }
}

export default Local
