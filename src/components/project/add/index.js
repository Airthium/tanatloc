import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import { Error } from '@/components/assets/notification'
import Dialog from '@/components/assets/dialog'

import ProjectAPI from '@/api/project'

/**
 * Errors project/add
 * @memberof module:components/project
 */
const errors = {
  addError: 'Unable to add a project'
}

/**
 * Add project
 * @memberof module:components/project
 * @param {Object} props Props
 */
const Add = ({ workspace, swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * Toggle dialog
   */
  const toggleDialog = () => {
    setVisible(!visible)
  }

  /**
   * On confirm
   * @param {Object} values Values
   */
  const onOk = async (values) => {
    setLoading(true)
    try {
      // Add
      const project = await ProjectAPI.add({ id: workspace.id }, values)

      // Mutate projects
      swr.addOneProject(project)

      // Mutate workspaces
      swr.mutateOneWorkspace({
        ...workspace,
        projects: [...workspace.projects, project.id]
      })

      // Close
      toggleDialog()
    } catch (err) {
      Error(errors.addError, err)
      setLoading(false)
    }
  }

  /**
   * On cancel
   */
  const onCancel = () => {
    toggleDialog()
  }

  /**
   * Render
   */
  return (
    <>
      <Button
        onClick={toggleDialog}
        type="primary"
        icon={<PlusCircleOutlined />}
      >
        Create a new project
      </Button>
      <Dialog
        title="Create a new project"
        closable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        loading={loading}
      >
        <Form.Item
          label="Name"
          name="title"
          rules={[{ required: true, message: "Please enter a project's name" }]}
        >
          <Input placeholder="Project's name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Project's description" />
        </Form.Item>
      </Dialog>
    </>
  )
}

Add.propTypes = {
  workspace: PropTypes.object.isRequired,
  swr: PropTypes.object.isRequired
}

export default Add
