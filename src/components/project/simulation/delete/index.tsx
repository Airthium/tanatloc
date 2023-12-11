/** @module Components.Project.Simulation.Delete */

import { useCallback, useContext, useState } from 'react'
import { Typography } from 'antd'

import {
  IFrontMutateProject,
  IFrontProject,
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { DeleteButton } from '@/components/assets/button'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export type Project = Pick<IFrontProject, 'id' | 'simulations'>
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'name'>
export type Swr = {
  mutateProject: (project: IFrontMutateProject) => Promise<void>
  delOneSimulation: (simulation: IFrontMutateSimulationsItem) => Promise<void>
}
export interface IProps {
  project: Project
  simulation: Simulation
  swr: Swr
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
  project: Project,
  simulation: Simulation,
  swr: Swr
): Promise<void> => {
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
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete: React.FunctionComponent<IProps> = ({
  project,
  simulation,
  swr
}) => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On delete
   */
  const onDelete = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _onDelete(project, simulation, swr)
    } catch (err: any) {
      dispatch(addError({ title: errors.del, err }))
      throw err
    } finally {
      setLoading(false)
    }
  }, [project, simulation, swr, dispatch])

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
