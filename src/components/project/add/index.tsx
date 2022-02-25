/** @module Components.Project.Add */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Form, Input } from 'antd'

import { IWorkspaceWithData } from '@/lib/index.d'

import Dialog from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'
import { AddButton } from '@/components/assets/button'

import ProjectAPI from '@/api/project'

export interface IProps {
  workspace: IWorkspaceWithData
  swr: {
    mutateOneWorkspace: Function
    addOneProject: Function
  }
}

/**
 * Errors (add)
 */
const errors = {
  addError: 'Unable to add a project'
}

/**
 * Add project
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
      ErrorNotification(errors.addError, err)
      setLoading(false)
      throw err
    }
  }

  /**
   * Render
   */
  return (
    <>
      <AddButton primary={false} dark onAdd={() => setVisible(true)}>
        Create a new project
      </AddButton>
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
          rules={[
            { required: true, message: 'Name is required' },
            {
              max: 50,
              message: 'Max 50 characters'
            }
          ]}
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
