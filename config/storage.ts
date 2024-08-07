/** @module Config.Storage */

import path from 'path'
import os from 'os'

/**
 * Default storage path
 *
 * Set as `${HOME}/tanatloc`
 */
export const DEFAULT_STORAGE: string = path.join(os.homedir(), 'tanatloc')

// STORAGE CHECK
if (!process.env.STORAGE_PATH)
  console.warn(
    ' ⚠ No storage path configured, use default one in: ' + DEFAULT_STORAGE
  )

/**
 * Storage path
 *
 * Set by `STORAGE_PATH` environment variable ot `DEFAULT_STORAGE`
 */
export const STORAGE: string = process.env.STORAGE_PATH ?? DEFAULT_STORAGE

/**
 * Avatar relative path
 *
 * Set by `AVATAR_RELATIVE_PATH` environment variable ot `avatar`
 */
export const AVATAR_RELATIVE: string =
  process.env.AVATAR_RELATIVE_PATH ?? 'avatar'

/**
 * Avatar path
 */
export const AVATAR: string = path.join(STORAGE, AVATAR_RELATIVE)

/**
 * Geometry relative path
 *
 * Set by `GEOMETRY_RELATIVE_PATH` environment variable ot `geometry`
 */
export const GEOMETRY_RELATIVE: string =
  process.env.GEOMETRY_RELATIVE_PATH ?? 'geometry'

/**
 * Geometry path
 */
export const GEOMETRY: string = path.join(STORAGE, GEOMETRY_RELATIVE)

/**
 * Simulation relative path
 *
 * Set by `SIMULATION_RELATIVE_PATH` environment variable ot `simulation`
 */
export const SIMULATION_RELATIVE: string =
  process.env.SIMULATION_RELATIVE_PATH ?? 'simulation'

/**
 * Simulation path
 */
export const SIMULATION: string = path.join(STORAGE, SIMULATION_RELATIVE)
