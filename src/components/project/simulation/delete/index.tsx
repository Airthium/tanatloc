/** @module Components.Project.Simulation.Delete */

import { useCallback, useState } from 'react'
import { Typography } from 'antd'

import {
  IFrontMutateProject,
  IFrontProject,
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  project: Pick<IFrontProject, 'id' | 'simulations'>
  simulation: Pick<IFrontSimulationsItem, 'id' | 'name'>
  swr: {
    mutateProject: (project: IFrontMutateProject) => Promise<void>
    delOneSimulation: (simulation: IFrontMutateSimulationsItem) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  del: 'Unable to delete simulation'
}

/**
 * On delete
 * @param project Project
 * @param simulation Simulation
 * @param swr SWR
 */
export const _onDelete = async (
  project: Pick<IFrontProject, 'id' | 'simulations'>,
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  swr: {
    mutateProject: (project: IFrontMutateProject) => Promise<void>
    delOneSimulation: (simulation: IFrontMutateSimulationsItem) => Promise<void>
  }
): Promise<void> => {
  try {
    // API
    await SimulationAPI.del(simulation)

    // Mutate project
    const filteredSimulations = project.simulations.filter(
      (s: string) => s !== simulation.id
    )
    await swr.mutateProject({
      id: project.id,
      simulations: filteredSimulations
    })

    // Mutate simulations
    await swr.delOneSimulation({ id: simulation.id })
  } catch (err: any) {
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
   * On delete
   */
  const onDelete = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _onDelete(project, simulation, swr)
    } finally {
      setLoading(false)
    }
  }, [project, simulation, swr])

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
      onDelete={onDelete}
    />
  )
}

export default Delete
