/** @module Components.Project.Simulation.Copy */

import { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'
import {
  IFrontProject,
  IFrontSimulationsItem,
  IFrontMutateProject,
  IFrontNewSimulation
} from '@/api/index.d'

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
export const onCopy = async (
  project: Pick<IFrontProject, 'id' | 'simulations'>,
  simulation: Pick<IFrontSimulationsItem, 'name' | 'scheme'>,
  swr: {
    mutateProject: (project: IFrontMutateProject) => void
    addOneSimulation: (simulation: IFrontNewSimulation) => void
  }
): Promise<void> => {
  try {
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
   * Render
   */
  return (
    <Tooltip title="Copy">
      <Button
        className="no-border"
        loading={loading}
        icon={<CopyOutlined />}
        onClick={async () => {
          setLoading(true)
          try {
            await onCopy(project, simulation, swr)
          } finally {
            setLoading(false)
          }
        }}
      />
    </Tooltip>
  )
}

export default Copy
