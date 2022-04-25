/** @module Components.Project.Simulation.Delete */

import { useState } from 'react'
import { Typography } from 'antd'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'
import {
  IFrontMutateProject,
  IFrontProject,
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

/**
 * Props
 */
export interface IProps {
  project: Pick<IFrontProject, 'id' | 'simulations'>
  simulation: Pick<IFrontSimulationsItem, 'id' | 'name'>
  swr: {
    mutateProject: (project: IFrontMutateProject) => void
    delOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

/**
 * Errors
 */
export const errors = {
  del: 'Unable to delete the simulation'
}

/**
 * On delete
 * @param project Project
 * @param simulation Simulation
 * @param swr SWR
 */
export const onDelete = async (
  project: Pick<IFrontProject, 'id' | 'simulations'>,
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  swr: {
    mutateProject: (project: IFrontMutateProject) => void
    delOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    // API
    await SimulationAPI.del(simulation)

    // Mutate project
    const filteredSimulations = project.simulations.filter(
      (s: string) => s !== simulation.id
    )
    swr.mutateProject({
      id: project.id,
      simulations: filteredSimulations
    })

    // Mutate simulations
    swr.delOneSimulation({ id: simulation.id })
  } catch (err) {
    ErrorNotification(errors.del, err)
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete = ({ project, simulation, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <DeleteButton
      loading={loading}
      text={
        <>
          Are you sure you want to delete the simulation{' '}
          <Typography.Text strong>{simulation.name}</Typography.Text>?
        </>
      }
      onDelete={async () => {
        setLoading(true)
        try {
          await onDelete(project, simulation, swr)
        } finally {
          setLoading(false)
        }
      }}
    />
  )
}

export default Delete
