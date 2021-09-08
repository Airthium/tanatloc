/** @module route/user */

import error from '../error'

import WaitLib from '@/lib/wait'

/**
 * Wait API
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  try {
    switch (req.method) {
      case 'POST':
        try {
          // Add
          await WaitLib.add(req.body)
          res.status(200).end()
        } catch (err) {
          throw error(500, err.message)
        }
        break
      default:
        // Unauthorized method
        throw error(402, 'Method ' + req.method + ' not allowed')
    }
  } catch (err) {
    res.status(err.status).json({ error: true, message: err.message })
  }
}
