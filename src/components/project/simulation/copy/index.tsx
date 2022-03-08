/** @module Components.Project.Simulation.Copy */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

import { ISimulation } from '@/database/index.d'
import { IProjectWithData } from '@/lib/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  project: IProjectWithData
  simulation: ISimulation
  swr: {
    mutateProject: (project: IProjectWithData) => void
    addOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * Errors (copy)
 */
const errors = {
  copy: 'Unable to copy simulation'
}

/**
 * Copy simulation
 * @param props Props
 */
const Copy = ({ project, simulation, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  /**
   * On copy
   */
  const onCopy = async (): Promise<void> => {
    setLoading(true)
    try {
      // Clear results
      const newScheme = { ...simulation.scheme }
      if (newScheme.configuration?.run) {
        newScheme.configuration.run.done = false
        newScheme.configuration.run.error = null
      }

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
        simulations: [...(project.simulations || []), newSimulation.id]
      })
    } catch (err) {
      ErrorNotification(errors.copy, err)
    } finally {
      // Loading
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <Tooltip title="Copy">
      <Button
        loading={loading}
        icon={<CopyOutlined />}
        onClick={onCopy}
        className="no-border"
      />
    </Tooltip>
  )
}

Copy.propTypes = {
  project: PropTypes.exact({
    id: PropTypes.string.isRequired,
    simulations: PropTypes.array.isRequired
  }).isRequired,
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    scheme: PropTypes.object.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateProject: PropTypes.func.isRequired,
    addOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default Copy
