import { getSession } from '../../../src/auth/iron'
import getById from '../../../src/database/query/user/getById'

export default async function user(req, res) {
  const session = await getSession(req)
  if (!session || !session.id) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  getById(session.id, ['email', 'firstname', 'lastname']).then((user) => {
    res.status(200).json({ user })
  })
}
