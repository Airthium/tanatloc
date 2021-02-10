import Caller from '@/api/call'

const add = async (plugin) => {
  return Caller.call('/api/plugin', {
    method: 'POST',
    body: JSON.stringify(plugin)
  })
}

export default add
