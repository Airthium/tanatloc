/** @module Plugins.Local */

import { LIMIT } from '@/config/string'

import { IPlugin } from '@/plugins/index.d'

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
          { max: LIMIT, message: 'Max ' + LIMIT + ' characters' }
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
