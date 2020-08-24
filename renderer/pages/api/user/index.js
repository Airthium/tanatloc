import { getSession } from '../../../../src/auth/iron'
import { getById } from '../../../../src/database/user'

export default async function (req, res) {
  const session = await getSession(req)
  if (!session || !session.id) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  getById(session.id, ['email', 'firstname', 'lastname']).then((user) => {
    res.status(200).json({ user })
  })
}
