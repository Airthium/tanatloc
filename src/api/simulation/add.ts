import { INewSimulation } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Add
 * @memberof API.Simulation
 * @param project Project
 * @param simulation Simulation
 * @returns Simulation
 */
export const add = async (
  project: { id: string },
  simulation: { name: string; scheme: object }
): Promise<INewSimulation> => {
  const response = await call('/api/simulation', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({
      project: { id: project.id },
      simulation: simulation
    })
  })

  return response.json()
}