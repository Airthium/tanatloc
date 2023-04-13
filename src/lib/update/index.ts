/** @module Lib.Update */

import isElectron from 'is-electron'

import packageJson from '../../../package.json'

export interface IUpdateFalse {
  needed: false
}

export interface IUpdateTrue {
  needed: boolean
  res: any
}

export type IUpdate = IUpdateFalse | IUpdateTrue

/**
 * Need update
 * @returns Update needed
 */
const needUpdate = async (): Promise<IUpdate> => {
  if (!isElectron())
    return {
      needed: false
    }

  // Get current version from github
  const response: any = await fetch(
    'https://api.github.com/repos/Airthium/tanatloc-electron/releases/latest',
    {
      method: 'GET'
    }
  )
  const json = await response.json()

  // Get current downloaded version
  const currentVersion = packageJson.version

  // Need update ?
  const needed =
    !json.tag_name.includes('alpha') &&
    !json.tag_name.includes('beta') &&
    currentVersion !== json.tag_name

  return {
    needed,
    res: json
  }
}

const Update = { needUpdate }
export default Update
