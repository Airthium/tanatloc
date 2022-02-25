/** @module Lib.System */

import { IDataBaseEntry, ISystem } from '@/database/index.d'

import SystemDB from '@/database/system'

/**
 * Get items
 * @params items Items
 * @returns System
 */
const get = async (items: string[]): Promise<ISystem> => {
  return SystemDB.get(items)
}

/**
 * Update items
 * @params items Items
 */
const update = async (items: IDataBaseEntry[]): Promise<void> => {
  await SystemDB.update(items)
}

const System = { get, update }
export default System
