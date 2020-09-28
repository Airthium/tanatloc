import getSessionId from '../session'
import { get } from '../../lib/simulation'

import Sentry from '../.../lib/sentry'

export default async (req, res) => {
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

    const simulationsTmp = await Promise.all(
      list.map(async (id) => {
        try {
          return await get(id)
        } catch (err) {
          console.warn(err)
          return null
        }
      })
    )

    const simulations = simulationsTmp.filter((p) => p)

    res.status(200).json({ simulations })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
    Sentry.captureException(err)
  }
}
