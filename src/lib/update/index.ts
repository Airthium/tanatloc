/** @module UPDATE */

import isElectron from 'is-electron'
import fetch from 'node-fetch'
import appData from '../../../package.json'

/**
 * Get latest version
 * @returns bool isUpdateNeeded
 */

const isUpdateNeeded = async (): Promise<boolean> => {
  const myToken = 'XXX'
  if (!isElectron()) return false

  // Get current version from github
  const response: any = await fetch(
    'https://api.github.com/repos/Airthium/tanatloc/releases/latest',
    {
      method: 'GET',
      headers: {
        Authorization: 'token ' + myToken
      }
    }
  )
  const json = await response.json()

  // Get current downloaded version
  const currentVersion = appData.version

  // Need update ?
  return currentVersion !== json.tag_name
}

export default isUpdateNeeded
