import { call } from '../call'

export default async (workspace) => {
  const res = await call('/api/workspace', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(workspace)
  })

  return res
}
