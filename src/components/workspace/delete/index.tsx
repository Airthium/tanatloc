/** @module Components.Workspace.Delete */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'

import { IWorkspaceWithData } from '@/lib/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import WorkspaceAPI from '@/api/workspace'

/**
 * Props
 */
export interface IProps {
  workspace: IWorkspaceWithData
  swr: {
    delOneWorkspace: (workspace: IWorkspaceWithData) => void
  }
}

/**
 * Errors
 */
export const errors = {
  del: 'Unable to delete the workspace'
}

/**
 * On delete
 * @param workspace Workspace
 * @param swr SWR
 */
export const onDelete = async (
  workspace: IWorkspaceWithData,
  swr: { delOneWorkspace: (workspace: IWorkspaceWithData) => void }
): Promise<void> => {
  try {
    // Delete
    await WorkspaceAPI.del({ id: workspace.id })

    // Mutate
    swr.delOneWorkspace({ id: workspace.id })
  } catch (err) {
    ErrorNotification(errors.del, err)
    throw err
  }
}

/**
 * Delete workspace
 * @param props Props
 * @returns Delete
 */
const Delete = ({ workspace, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  /**
   * Render
   */
  return (
    <DeleteButton
      bordered
      loading={loading}
      text="The projects contained in this workspace will be lost."
      onDelete={async () => {
        setLoading(true)
        try {
          await onDelete(workspace, swr)
        } finally {
          setLoading(false)
        }
      }}
    />
  )
}

Delete.propTypes = {
  workspace: PropTypes.exact({
    id: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    delOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
