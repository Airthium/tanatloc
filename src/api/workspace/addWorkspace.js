import { call } from '../call'

export default async (workspace) => {
  const res = await call('/api/workspace', {
    method: 'POST',
    body: JSON.stringify(workspace)
  })
  return res
}
