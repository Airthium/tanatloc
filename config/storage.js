const path = require('path')

const storagePath = process.env.STORAGE_PATH || '/tmp/tanatloc'

module.exports = {
  STORAGE: storagePath,
  AVATAR: path.join(storagePath, process.env.AVATAR_RELATIVE_PATH || 'avatar'),
  SIMULATION: path.join(
    storagePath,
    process.env.SIMULATION_RELATIVE_PATH || 'simulation'
  )
}
