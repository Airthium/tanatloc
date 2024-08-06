/** @module Lib.System */

import { IDataBaseEntry } from '@/database/index.d'

import SystemDB, { ISystem, TSystemGet } from '@/database/system'

/**
 * Get items
 * @param items Items
 * @returns System
 */
const get = async <T extends TSystemGet>(items: T): Promise<ISystem<T>> => {
  return SystemDB.get(items)
}

/**
 * Update items
 * @param items Items
 */
const update = async (items: IDataBaseEntry[]): Promise<void> => {
  await SystemDB.update(items)
}

const System = { get, update }
export default System
