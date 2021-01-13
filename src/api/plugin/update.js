import Caller from '../call'

const update = async (plugins) => {
  return Caller.call('/api/plugin', {
    method: 'PUT',
    body: JSON.stringify(plugins)
  })
}

export default update
