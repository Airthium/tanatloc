/** @module Components.Project.Simulation.Copy */

import { useCallback, useContext, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

import {
  IFrontProject,
  IFrontSimulationsItem,
  IFrontMutateProject,
  IFrontNewSimulation
} from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import SimulationAPI from '@/api/simulation'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export type Project = Pick<IFrontProject, 'id' | 'simulations'>
export type Simulation = Pick<IFrontSimulationsItem, 'id'>
export type Swr = {
  mutateProject: (project: IFrontMutateProject) => Promise<void>
  addOneSimulation: (simulation: IFrontNewSimulation) => Promise<void>
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
  copy: 'Unable to copy simulation'
}

/**
 * On copy
 * @param project Project
 * @param simulation Simulation
 * @param swr SWR
 */
export const _onCopy = async (
  project: Project,
  simulation: Simulation,
  swr: Swr
): Promise<void> => {
  // New simulation
  const newSimulation = await SimulationAPI.copy(simulation)

  // Mutate simulations
  await swr.addOneSimulation(newSimulation)

  // Mutate project
  await swr.mutateProject({
    id: project.id,
    simulations: [...project.simulations, newSimulation.id]
  })
}

/**
 * Copy simulation
 * @param props Props
 * @returns Copy
 */
const Copy: React.FunctionComponent<IProps> = ({
  project,
  simulation,
  swr
}) => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On click
   */
  const onClick = useCallback((): void => {
    ;(async () => {
      setLoading(true)
      try {
        await _onCopy(project, simulation, swr)
      } catch (err: any) {
        dispatch(addError({ title: errors.copy, err }))
      } finally {
        setLoading(false)
      }
    })()
  }, [project, simulation, swr, dispatch])

  /**
   * Render
   */
  return (
    <Tooltip title="Copy simulation">
      <Button
        className={globalStyle.noBorder}
        loading={loading}
        icon={<CopyOutlined />}
        onClick={onClick}
      />
    </Tooltip>
  )
}

export default Copy
