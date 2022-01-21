import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import ProjectAPI from '@/api/project'

import { IWorkspaceWithData } from '@/lib'

export interface IProps {
  workspace: IWorkspaceWithData
  swr: {
    mutateOneWorkspace: Function
    addOneProject: Function
  }
}

/**
 * Errors (add)
 * @memberof Components.Project
 */
const errors = {
  addError: 'Unable to add a project'
}

/**
 * Add project
 * @memberof Components.Project
 * @param props Props
 */
const Add = ({ workspace, swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On add
   * @param values Values
   */
  const onAdd = async (values: {
    title: string
    description: string
  }): Promise<void> => {
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
      setLoading(false)
      setVisible(false)
    } catch (err) {
      Error(errors.addError, err)
      setLoading(false)
      throw err
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Button onClick={() => setVisible(true)} icon={<PlusCircleOutlined />}>
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
          rules={[{ required: true, message: 'Please enter a project name' }]}
        >
          <Input placeholder="Project's name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea
            showCount
            maxLength={120}
            placeholder="Project's description"
          />
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
