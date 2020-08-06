import { getSession } from '../../../src/auth/iron'
import getByUserId from '../../../src/database/query/workspace/getByUserId'

export default async function user(req, res) {
  const session = await getSession(req)
  if (!session || !session.id) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  getByUserId(session.id).then((workspaces) => {
    res.status(200).json({ workspaces })
  })
}
