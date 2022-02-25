/** @module Components.Project.Delete */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { IProjectWithData, IWorkspaceWithData } from '@/lib/index.d'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import ProjectAPI from '@/api/project'

export interface IProps {
  disabled?: boolean
  workspace: IWorkspaceWithData
  project: IProjectWithData
  swr: {
    mutateOneWorkspace: Function
    delOneProject: Function
  }
}

/**
 * Errors (delete)
 */
const errors = {
  delError: 'Unable to delete the project'
}

/**
 * Delete project
 * @param props Props
 */
const Delete = ({ disabled, workspace, project, swr }: IProps): JSX.Element => {
  // Sate
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On delete
   */
  const onDelete = async (): Promise<void> => {
    setLoading(true)
    try {
      // Delete
      await ProjectAPI.del(workspace, project)

      // Mutate workspaces
      const index = workspace.projects.findIndex((p) => p === project.id)
      workspace.projects = [
        ...workspace.projects.slice(0, index),
        ...workspace.projects.slice(index + 1)
      ]
      swr.mutateOneWorkspace(workspace)

      // Mutate projects
      swr.delOneProject({ id: project.id })

      // Close
      setVisible(false)
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
      <Tooltip title="Delete">
        <Button
          disabled={disabled}
          type="link"
          danger
          onClick={() => setVisible(true)}
          icon={<DeleteOutlined />}
        />
      </Tooltip>
      <DeleteDialog
        title="Delete the project"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onDelete}
        loading={loading}
      >
        Are you sure you want to delete {project.title} ?
      </DeleteDialog>
    </>
  )
}

Delete.propTypes = {
  disabled: PropTypes.bool,
  workspace: PropTypes.exact({
    id: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired
  }).isRequired,
  project: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneWorkspace: PropTypes.func.isRequired,
    delOneProject: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
