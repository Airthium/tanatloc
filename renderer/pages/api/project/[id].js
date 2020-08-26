import { getSession } from '../../../../src/auth/iron'
import { getById, update, del } from '../../../../src/database/project'

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

  // Id
  let id = req.query.id
  if (!id) {
    // Electron
    id = req.params.id
  }

  switch (req.method) {
    case 'GET':
      try {
        const project = await getById(id)
        res.status(200).json({ project })
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
        await del(req.body, { id })
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
