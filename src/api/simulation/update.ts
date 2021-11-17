import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update
 * @memberof API.Simulation
 * @param {Object} simulation Simulation `{ id }`
 * @param {Array} data Data `[{ key, value, ... }, ...]`
 */
export const update = async (
  simulation: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await call('/api/simulation/' + simulation.id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}
