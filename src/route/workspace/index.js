import getSessionId from '../session'
import { add, getByUser, update, del } from '../../lib/workspace'

/**
 * Workspace API
 * @memberof module:api
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async function (req, res) {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  switch (req.method) {
    case 'GET':
      try {
        const workspaces = await getByUser({ id: sessionId })
        res.status(200).json({ workspaces })
      } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
      }
      break
    case 'POST':
      try {
        const workspace = await add({ id: sessionId }, req.body)
        res.status(200).json(workspace)
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
        await del({ id: sessionId }, req.body)
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
