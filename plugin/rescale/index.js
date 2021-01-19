import logo from './logo.svg'
import Renderer from './renderer'

console.log(Renderer)

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
  inUseConfiguration: {
    renderer: Renderer,
    more: {
      label:
        'More information on <a href="https://www.rescale.com/infrastructure/" target="_blank">Rescale website</a>.',
      type: 'label'
    },
    coreTypes: {
      label: 'Core type',
      type: 'select',
      options: []
    },
    numberOfNodes: {
      label: 'Number of nodes',
      type: 'number',
      default: 1
    },
    lowPriority: {
      label: 'On-Demand',
      type: 'radio',
      options: [
        {
          label: 'On-Demand',
          value: true
        },
        {
          label: 'On-Demand Pro',
          value: false
        }
      ]
    }
  }
}

export default Rescale
