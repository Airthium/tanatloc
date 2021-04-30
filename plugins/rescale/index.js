import Renderer from './src/components'

const Rescale = {
  category: 'HPC',
  key: 'rescale',
  name: 'Rescale plugin',
  logo: '/images/rescale.svg',
  description:
    '<p><a target="_blank" href="https://www.rescale.com/">Rescale</a>: Intelligent HPC Platform</p>',
  configuration: {
    name: {
      required: true,
      label: 'Name',
      type: 'input'
    },
    token: {
      required: true,
      label: 'Token',
      type: 'password'
    },
    platform: {
      required: true,
      label: 'Platform',
      type: 'select',
      options: ['platform.rescale.com', 'eu.rescale.com', 'platform.rescale.jp']
    },
    organization: {
      label: 'Organization name',
      type: 'input'
    },
    project: {
      label: 'Project id',
      type: 'input'
    },
    additionalFiles: {
      label: 'Additional files (id1, id2, ...)',
      type: 'input'
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
