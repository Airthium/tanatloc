/** @module Server.Init.Database */

import { checkdB, startdB } from '@/database'

/**
 * Init database
 */
export const initDatabase = async (params?: {
  addStatus: (status: string) => Promise<void>
}): Promise<void> => {
  if (!tanatloc?.pool) {
    await checkdB(params)
    tanatloc.pool = startdB()
  }
}
