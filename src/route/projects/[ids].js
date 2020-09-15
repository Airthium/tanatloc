import getSessionId from '../session'
import { get } from '../../lib/project'

import Sentry from '../../lib/sentry'

/**
 * Projects API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async function (req, res) {
  // Check session
  const sessionId = await getSessionId(req, res)
  if (!sessionId) return

  try {
    // Ids
    let ids = req.query.ids
    if (!ids) {
      // Electron
      ids = req.params.ids
    }

    if (ids === 'undefined' || ids === 'null') {
      res.status(200).end()
      return
    }

    const list = ids.split('&')

    const projectsTmp = await Promise.all(
      list.map(async (id) => {
        let project
        try {
          project = await get(id)
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
    Sentry.captureException(err)
  }
}
