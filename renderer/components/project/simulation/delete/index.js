import { useState } from 'react'
import { message, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '../../../assets/dialog'

import SimulationAPI from '../../../../../src/api/simulation'
import ProjectAPI from '../../../../../src/api/project'

import Sentry from '../../../../../src/lib/sentry'

/**
 * Errors simulation/delete
 * @memberof module:renderer/components/project/simulation
 */
const errors = {
  delError: 'Unable to delete the simulation'
}

/**
 * Delete
 * @memberof module:renderer/components/project/simulation
 * @param {Object} props Props
 */
const Delete = ({ project, simulation }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data
  const [, { delOneSimulation }] = SimulationAPI.useSimulations(
    project?.simulations
  )
  const [, { mutateProject }] = ProjectAPI.useProject(project?.id)

  const toggleDialog = () => {
    setVisible(!visible)
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      // Delete
      await SimulationAPI.del(project, simulation)

      // Mutate project
      const index = project.simulations.findIndex((s) => s.id === simulation.id)
      project.simulations = [
        ...project.simulations.slice(0, index),
        ...project.simulations.slice(index + 1)
      ]
      mutateProject(project)

      // Mutate simulations
      delOneSimulation({ id: simulation.id })

      toggleDialog()
    } catch (err) {
      message.error(errors.delError)
      console.error(err)
      Sentry.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button type="danger" icon={<DeleteOutlined />} onClick={toggleDialog}>
        Delete
      </Button>
      <DeleteDialog
        visible={visible}
        onCancel={toggleDialog}
        onOk={handleDelete}
        loading={loading}
      >
        Delete {simulation.name}
      </DeleteDialog>
    </>
  )
}

export default Delete
