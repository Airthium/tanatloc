/** @module route/groups */

/**
 * Empty groups list route
 * @param {Object} req Request
 * @param {Object} res Response
 */
export default async (req, res) => {
  // Empty route
  res.status(200).json({ groups: [] })
}
