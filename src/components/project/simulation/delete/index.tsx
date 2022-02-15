import PropTypes from 'prop-types'
import { useState } from 'react'

import { ISimulation } from '@/database/index.d'
import { IProjectWithData } from '@/lib/index.d'

import { Error } from '@/components/assets/notification'
import { DeleteButton } from '@/components/assets/button'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  project: IProjectWithData
  simulation: ISimulation
  swr: {
    mutateProject: (project: IProjectWithData) => void
    delOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * Errors (delete)
 * @memberof Components.Project.Simulation
 */
const errors = {
  delError: 'Unable to delete the simulation'
}

/**
 * Delete
 * @memberof Components.Project.Simulation
 * @param props Props
 */
const Delete = ({ project, simulation, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On delete
   */
  const onDelete = async (): Promise<void> => {
    setLoading(true)
    try {
      // API
      await SimulationAPI.del(simulation)

      // Mutate project
      const filteredSimulations = project.simulations.filter(
        (s) => s !== simulation.id
      )
      swr.mutateProject({
        id: project.id,
        simulations: filteredSimulations
      })

      // Mutate simulations
      swr.delOneSimulation({ id: simulation.id })
    } catch (err) {
      Error(errors.delError, err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <DeleteButton
      loading={loading}
      text={'Are you sure you want to delete ' + simulation.name + '?'}
      onDelete={onDelete}
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
