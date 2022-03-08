/** @module Components.Project.Simulation.Delete */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'

import { ISimulation } from '@/database/index.d'
import { IProjectWithData } from '@/lib/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  project: IProjectWithData
  simulation: ISimulation
  swr: {
    mutateProject: (project: IProjectWithData) => void
    delOneSimulation: (simulation: ISimulation) => void
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
  project: IProps['project'],
  simulation: IProps['simulation'],
  swr: IProps['swr']
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
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  /**
   * Render
   */
  return (
    <DeleteButton
      loading={loading}
      text={'Are you sure you want to delete ' + simulation.name + '?'}
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

Delete.propTypes = {
  project: PropTypes.exact({
    id: PropTypes.string.isRequired,
    simulations: PropTypes.array.isRequired
  }).isRequired,
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateProject: PropTypes.func.isRequired,
    delOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
