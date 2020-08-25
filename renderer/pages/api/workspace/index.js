import { getSession } from '../../../../src/auth/iron'
import {
  getByUserId,
  add,
  update,
  del
} from '../../../../src/database/workspace'

/**
 * Workspace API
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

  switch (req.method) {
    case 'GET':
      try {
        const workspaces = await getByUserId(session.id)
        res.status(200).json({ workspaces })
      } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
      }
      break
    case 'POST':
      try {
        const workspace = await add(session.id, req.body)
        res.status(200).json({ workspace })
      } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
      }
      break
    case 'PUT':
      try {
        await update(req.body)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(204).json({ message: err.message })
      }
      break
    case 'DELETE':
      try {
        await del(session.id, req.body)
        res.status(200).end()
      } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
      }
      break
    default:
      res.status(405).json({ message: 'Method ' + req.method + ' not allowed' })
  }
}
