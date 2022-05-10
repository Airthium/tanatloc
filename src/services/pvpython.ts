/** @module Services.Pvpython */

import { execSync, spawn } from 'child_process'
import path from 'path'
import isDocker from 'is-docker'

const pvpython = async (
  bindPath: string,
  script: string,
  fileIn: string,
  fileOut: string,
  parameters: string[]
) => {
  // Enfore POSIX
  const scriptPOSIX = script.split(path.sep).join(path.posix.sep)
  const fileInPOSIX = fileIn.split(path.sep).join(path.posix.sep)
  const fileOutPOSIX = fileOut.split(path.sep).join(path.posix.sep)

  return new Promise((resolve, reject) => {
    let run: any

    if (isDocker()) {
      // TODO
    } else {
      const user =
        process.platform === 'win32'
          ? 1000
          : execSync('id -u').toString().trim()
      const group =
        process.platform === 'win32'
          ? 1000
          : execSync('id -g').toString().trim()
      // TODO rebuild tanatloc-dockers before do that
    }
  })
}
