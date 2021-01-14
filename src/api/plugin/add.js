import Caller from '../call'

const add = async (plugin) => {
  return Caller.call('/api/plugin', {
    method: 'POST',
    body: JSON.stringify(plugin)
  })
}

export default add
