import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { Error } from '@/components/assets/notification'
import { DeleteDialog } from '@/components/assets/dialog'

import SimulationAPI from '@/api/simulation'
import ProjectAPI from '@/api/project'

/**
 * Errors simulation/delete
 * @memberof module:'src/components/project/simulation
 */
const errors = {
  delError: 'Unable to delete the simulation'
}

/**
 * Delete
 * @memberof module:'src/components/project/simulation
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
      Error(errors.delError, err)
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
