const Rescale = {
  category: 'HPC',
  name: 'Rescale plugin',
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
      options: ['platfrom.rescale.com', 'eu.rescale.com', 'platform.rescale.jp']
    }
  }
}

export default Rescale
