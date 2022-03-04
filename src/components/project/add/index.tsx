/** @module Components.Project.Add */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Form, Input } from 'antd'

import { IWorkspaceWithData } from '@/lib/index.d'
import { INewProject } from '@/database/index.d'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import ProjectAPI from '@/api/project'

/**
 * Props
 */
export interface IProps {
  workspace: IWorkspaceWithData
  swr: {
    mutateOneWorkspace: (workspace: IWorkspaceWithData) => void
    addOneProject: (project: INewProject) => void
  }
}

/**
 * Errors
 */
const errors = {
  addError: 'Unable to add a project'
}

/**
 * On add
 * @param workspace Workspace
 * @param values Values
 * @param swr SWR
 */
const onAdd = async (
  workspace: IWorkspaceWithData,
  values: {
    title: string
    description: string
  },
  swr: {
    addOneProject: (project: INewProject) => void
    mutateOneWorkspace: (workspace: IWorkspaceWithData) => void
  }
): Promise<void> => {
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
  } catch (err) {
    ErrorNotification(errors.addError, err)
    throw err
  }
}

/**
 * Add
 * @param props Props
 * @returns Add
 */
const Add = ({ workspace, swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

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
        onOk={async (values) => {
          setLoading(true)
          try {
            await onAdd(workspace, values, swr)
            // Close
            setLoading(false)
            setVisible(false)
          } catch (err) {
            setLoading(false)
            throw err
          }
        }}
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
  workspace: PropTypes.exact({
    id: PropTypes.string.isRequired,
    projects: PropTypes.array
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneWorkspace: PropTypes.func.isRequired,
    addOneProject: PropTypes.func.isRequired
  }).isRequired
}

export default Add
