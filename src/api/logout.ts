/** @module API.Logout */

import isElectron from 'is-electron'

const base: string = isElectron() ? 'http://localhost:3000' : ''

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
  await fetch(base + '/api/logout')
}
