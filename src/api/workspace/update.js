import { call } from '../call'

export default async (workspace, data) => {
  const res = await call('/api/workspace', {
    method: 'PUT',
    body: JSON.stringify({ workspace: workspace, data: data })
  })

  return res
}
