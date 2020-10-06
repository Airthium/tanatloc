import { useState } from 'react'
import { message, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '../../../assets/dialog'

import { useSimulations, del } from '../../../../../src/api/simulation'
import { useProject } from '../../../../../src/api/project'

import Sentry from '../../../../../src/lib/sentry'

const Delete = ({ project, simulation }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data
  const [, { delOneSimulation }] = useSimulations(project?.simulations)
  const [, { mutateProject }] = useProject(project?.id)

  const toggleDialog = () => {
    setVisible(!visible)
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      // Delete
      await del(project, simulation)

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
      message.error(err.message)
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
