import Renderer from './src/components'

const Local = {
  category: 'HPC',
  key: 'local',
  name: 'Local',
  description: '<p>Local</p>',
  configuration: {
    name: {
      label: 'Name',
      type: 'input'
    }
  },
  renderer: Renderer,
  inUseConfiguration: {}
}

export default Local
