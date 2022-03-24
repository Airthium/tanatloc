/** @module Components.Project.Delete */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Alert, Typography } from 'antd'

import { IProjectWithData, IWorkspaceWithData } from '@/lib/index.d'

import { DeleteButton } from '@/components/assets/button'
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
export const errors = {
  del: 'Unable to delete the project'
}

/**
 * On delete
 * @param workspace Workspace
 * @param project Project
 * @param swr SWR
 */
export const onDelete = async (
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
    ErrorNotification(errors.del, err)
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
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  /**
   * Render
   */
  return (
    <DeleteButton
      disabled={disabled}
      loading={loading}
      title="Delete the project"
      text={
        <>
          Are you sure you want to delete the project{' '}
          <Typography.Text strong>{project.title}</Typography.Text>?
          <Alert
            type="error"
            message="If you delete the project, you will no longer be able to restore the archive"
          />
        </>
      }
      onDelete={async () => {
        setLoading(true)
        try {
          await onDelete(workspace, project, swr)
        } finally {
          setLoading(false)
        }
      }}
    />
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
