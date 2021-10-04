import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

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
 * @param {Object} props Props
 */
const Delete = ({ project, simulation, swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * On delete
   */
  const onDelete = async () => {
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
      <Button
        type="danger"
        icon={<DeleteOutlined />}
        onClick={() => setVisible(true)}
      >
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
