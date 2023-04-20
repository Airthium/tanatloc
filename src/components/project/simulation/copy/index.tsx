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

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  project: Pick<IFrontProject, 'id' | 'simulations'>
  simulation: Pick<IFrontSimulationsItem, 'id' | 'name' | 'scheme'>
  swr: {
    mutateProject: (project: IFrontMutateProject) => void
    addOneSimulation: (simulation: IFrontNewSimulation) => void
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
  simulation: Pick<IFrontSimulationsItem, 'name' | 'scheme'>,
  swr: {
    mutateProject: (project: IFrontMutateProject) => void
    addOneSimulation: (simulation: IFrontNewSimulation) => void
  }
): Promise<void> => {
  try {
    // TODO do it in backend and copy geometries, meshes and results (?)
    // Clear results
    const newScheme = Utils.deepCopy(simulation.scheme)
    newScheme.configuration.run.done = false
    newScheme.configuration.run.error = undefined

    // API
    const newSimulation = await SimulationAPI.add(
      { id: project.id },
      { name: simulation.name + ' (copy)', scheme: newScheme }
    )

    // Mutate simulations
    swr.addOneSimulation(newSimulation)

    // Mutate project
    swr.mutateProject({
      id: project.id,
      simulations: [...project.simulations, newSimulation.id]
    })
  } catch (err) {
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
