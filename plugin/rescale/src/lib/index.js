import call from './call'

const key = 'rescale'

const init = async (configuration) => {
  // Get coretypes
  const coreTypes = await call({
    platform: configuration.platform.value,
    token: configuration.token.value,
    route: 'coretypes/?page_size=50'
  })

  console.log(coreTypes)

  // Check token
  if (coreTypes.detail === 'Invalid token.') throw new Error(coreTypes.detail)

  return {
    data: {
      coreTypes: coreTypes.results
    }
  }
}

export default { key, init }
