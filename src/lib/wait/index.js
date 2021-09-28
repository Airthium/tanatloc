/** @module lib/wait */

import WaitDB from '@/database/wait'

/**
 * Add
 * @param {Object} user { email}
 */
const add = async ({ email }) => {
  WaitDB.add({ email })
}

export default { add }
