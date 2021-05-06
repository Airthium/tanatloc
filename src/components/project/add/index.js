import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

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
   * On add
   * @param {Object} values Values
   */
  const onAdd = async (values) => {
    setLoading(true)
    try {
      // Add
      const project = await ProjectAPI.add({ id: workspace.id }, values)

      // Mutate projects
      swr.addOneProject(project)

      // Mutate workspaces
      swr.mutateOneWorkspace({
        ...workspace,
        projects: [...(workspace.projects || []), project.id]
      })

      // Close
      setVisible(false)
    } catch (err) {
      Error(errors.addError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Button
        onClick={() => setVisible(true)}
        type="primary"
        icon={<PlusCircleOutlined />}
      >
        Create a new project
      </Button>
      <Dialog
        title="Create a new project"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onAdd}
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
  workspace: PropTypes.shape({
    id: PropTypes.string.isRequired,
    projects: PropTypes.array
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneWorkspace: PropTypes.func.isRequired,
    addOneProject: PropTypes.func.isRequired
  }).isRequired
}

export default Add
