/** @module Components.Project.Simulation.Copy */

import { useCallback, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

import {
  IFrontProject,
  IFrontSimulationsItem,
  IFrontMutateProject,
  IFrontNewSimulation
} from '@/api/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  project: Pick<IFrontProject, 'id' | 'simulations'>
  simulation: Pick<IFrontSimulationsItem, 'id'>
  swr: {
    mutateProject: (project: IFrontMutateProject) => Promise<void>
    addOneSimulation: (simulation: IFrontNewSimulation) => Promise<void>
  }
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
  project: Pick<IFrontProject, 'id' | 'simulations'>,
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  swr: {
    mutateProject: (project: IFrontMutateProject) => Promise<void>
    addOneSimulation: (simulation: IFrontNewSimulation) => Promise<void>
  }
): Promise<void> => {
  try {
    // New simulation
    const newSimulation = await SimulationAPI.copy(simulation)

    // Mutate simulations
    await swr.addOneSimulation(newSimulation)

    // Mutate project
    await swr.mutateProject({
      id: project.id,
      simulations: [...project.simulations, newSimulation.id]
    })
  } catch (err: any) {
    ErrorNotification(errors.copy, err)
  }
}

/**
 * Copy simulation
 * @param props Props
 * @returns Copy
 */
const Copy = ({ project, simulation, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * On click
   */
  const onClick = useCallback(async () => {
    setLoading(true)
    try {
      await _onCopy(project, simulation, swr)
    } finally {
      setLoading(false)
    }
  }, [project, simulation, swr])

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
