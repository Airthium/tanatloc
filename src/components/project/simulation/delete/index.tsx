import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { ISimulation } from '@/database/index.d'
import { IProjectWithData } from '@/lib/index.d'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

interface IProps {
  project: IProjectWithData
  simulation: ISimulation
  swr: {
    mutateProject: Function
    delOneSimulation: Function
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
  const [visible, setVisible]: [boolean, Function] = useState(false)
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
        simulations: filteredSimulations
      })

      // Mutate simulations
      swr.delOneSimulation({ id: simulation.id })
    } catch (err) {
      Error(errors.delError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Button danger icon={<DeleteOutlined />} onClick={() => setVisible(true)}>
        Delete
      </Button>
      <DeleteDialog
        title="Delete the simulation"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onDelete}
        loading={loading}
      >
        Delete {simulation.name}
      </DeleteDialog>
    </>
  )
}

Delete.propTypes = {
  project: PropTypes.exact({
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
