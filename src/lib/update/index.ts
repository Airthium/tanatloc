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

  console.log(currentVersion)
  console.log(packageJson.version)

  // Need update ?
  return {
    needed: currentVersion !== json.tag_name,
    res: json
  }
}

const Update = { needUpdate }
export default Update
