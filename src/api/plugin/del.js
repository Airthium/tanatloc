import Caller from '@/api/call'

const del = async (plugin) => {
  return Caller.call('/api/plugin', {
    method: 'DELETE',
    body: JSON.stringify(plugin)
  })
}

export default del
