/** @module Lib.System */

import SystemDB from '@/database/system'
import { IDataBaseEntry, ISystem } from '@/database/index.d'

/**
 * Get items
 * @memberof Lib.System
 * @params items Items
 * @returns System
 */
const get = async (items: string[]): Promise<ISystem> => {
  return SystemDB.get(items)
}

/**
 * Update items
 * @memberof Lib.System
 * @params items Items
 */
const update = async (items: IDataBaseEntry[]): Promise<void> => {
  await SystemDB.update(items)
}

const System = { get, update }
export default System
