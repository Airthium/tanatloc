import logo from './logo.svg'
import Renderer from './src/components'

const Rescale = {
  category: 'HPC',
  key: 'rescale',
  name: 'Rescale plugin',
  logo: logo,
  description:
    '<p><a target="_blank" href="https://www.rescale.com/">Rescale</a>: Intelligent HPC Platform</p>',
  configuration: {
    name: {
      label: 'Name',
      type: 'input'
    },
    token: {
      label: 'Token',
      type: 'password'
    },
    platform: {
      label: 'Platform',
      type: 'select',
      options: ['platform.rescale.com', 'eu.rescale.com', 'platform.rescale.jp']
    }
  },
  needInit: true,
  data: {
    coreTypes: []
  },
  renderer: Renderer,
  inUseConfiguration: {
    coreTypes: {
      label: 'Core type'
    },
    numberOfCores: {
      label: 'Number of cores'
    },
    lowPriority: {
      label: 'Low priority'
    },
    freefemVersion: {
      label: 'FreeFEM version'
    }
  }
}

export default Rescale
