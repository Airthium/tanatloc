/** @module API.Simulation.Update */

import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update
 * @param simulation Simulation
 * @param data Data
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
