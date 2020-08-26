import { getSession } from '../../../../src/auth/iron'
import { add } from '../../../../src/database/project'

/**
 * Project API
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async function (req, res) {
  const session = await getSession(req)
  if (!session || !session.id) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  if (req.method === 'POST') {
    try {
      const project = await add(session.id, req.body)
      res.status(200).json({ project })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: err.message })
    }
  } else {
    res.status(405).json({ message: 'Method ' + req.method + ' not allowed' })
  }
}
