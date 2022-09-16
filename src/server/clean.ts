import { execSync } from 'child_process'

import { stopdB } from '@/database'

/**
 * Stop docker
 */
const stopDocker = async (): Promise<void> => {
  try {
    let id = execSync(
      'docker container ls -a --filter "name=tanatloc-postgres" -q'
    )

    if (id.length) execSync('docker container stop ' + id)
  } catch (err) {}
}

/**
 * Clean
 */
const clean = async (): Promise<void> => {
  await stopdB()
  await stopDocker()
}

export default clean
