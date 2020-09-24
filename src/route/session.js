import { getSession } from '../auth/iron'

/**
 * Session
 * @memberof module:src/route
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  const session = await getSession(req)
  if (!session || !session.id) {
    res.status(401).json({ message: 'Unauthorized' })
    return null
  }
  return session.id
}
