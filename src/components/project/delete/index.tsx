/** @module Components.Project.Delete */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { IProjectWithData, IWorkspaceWithData } from '@/lib/index.d'

import { DeleteDialog } from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import ProjectAPI from '@/api/project'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  workspace: IWorkspaceWithData
  project: IProjectWithData
  swr: {
    mutateOneWorkspace: (workspace: IWorkspaceWithData) => void
    delOneProject: (project: IProjectWithData) => void
  }
}

/**
 * Errors
 */
const errors = {
  delError: 'Unable to delete the project'
}

/**
 * On delete
 */
const onDelete = async (
  workspace: IWorkspaceWithData,
  project: IProjectWithData,
  swr: {
    mutateOneWorkspace: (workspace: IWorkspaceWithData) => void
    delOneProject: (project: IProjectWithData) => void
  }
): Promise<void> => {
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
  } catch (err) {
    ErrorNotification(errors.delError, err)
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete = ({ disabled, workspace, project, swr }: IProps): JSX.Element => {
  // Sate
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

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
        onOk={async () => {
          setLoading(true)
          try {
            onDelete(workspace, project, swr)
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
