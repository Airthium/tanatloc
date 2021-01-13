import logo from './logo.svg'

const Rescale = {
  category: 'HPC',
  key: 'rescale',
  name: 'Rescale plugin',
  logo: logo,
  description:
    '<p><a target="_blank" href="https://www.rescale.com/">Rescale</a>: Intelligent HPC Platform</p>',
  configuration: {
    token: {
      label: 'Token',
      type: 'password'
    },
    platform: {
      label: 'Platform',
      type: 'select',
      options: ['platform.rescale.com', 'eu.rescale.com', 'platform.rescale.jp']
    }
  }
}

export default Rescale
