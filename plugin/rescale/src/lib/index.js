import call from './call'

const key = 'rescale'

const init = async (configuration) => {
  // Get coretypes
  const coreTypes = await call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route: 'coretypes/?page_size=50'
  })

  if (coreTypes.detail === 'Invalid token.') throw new Error(coreTypes.detail)

  return {
    inUseConfiguration: {
      coreTypes: {
        label: 'Core type',
        type: 'select',
        options: coreTypes.results.map((r) => r.code)
      }
    }
  }
}

export default { key, init }
