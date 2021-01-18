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

  console.log(coreTypes.results)

  return {
    inUseConfiguration: {
      coreTypes: {
        options: coreTypes.results.map((r) => ({
          value: r.code,
          label: r.name
        }))
      }
    }
  }
}

export default { key, init }
