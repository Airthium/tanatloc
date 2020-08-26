import { getSession } from '../../../../src/auth/iron'
import { getById } from '../../../../src/database/project'

/**
 * Projects API
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

  try {
    // Ids
    let ids = req.query.ids
    if (!ids) {
      // Electron
      ids = req.params.ids
    }

    if (ids === 'undefined' || ids === 'null') {
      res.send(200)
      return
    }

    const list = ids.split('&')

    const projectsTmp = await Promise.all(
      list.map(async (id) => {
        let project
        try {
          project = await getById(id)
        } catch (err) {
          console.error(err)
        }
        return project
      })
    )

    const projects = projectsTmp.filter((p) => p)

    res.status(200).json({ projects })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}
