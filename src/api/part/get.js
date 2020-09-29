import { call } from '../call'

const get = async (simulation, file) => {
  const res = await call('/api/part', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ simulation, file })
  })

  return res
}

export default get
