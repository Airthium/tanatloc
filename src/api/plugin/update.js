import Caller from '@/api/call'

const update = async (plugin) => {
  return Caller.call('/api/plugin', {
    method: 'PUT',
    body: JSON.stringify(plugin)
  })
}

export default update
