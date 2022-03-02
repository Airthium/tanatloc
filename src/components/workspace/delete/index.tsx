/** @module Components.Workspace.Delete */

import PropTypes from 'prop-types'
import { useState } from 'react'

import { ErrorNotification } from '@/components/assets/notification'
import { DeleteButton } from '@/components/assets/button'

import WorkspaceAPI from '@/api/workspace'

export interface IProps {
  workspace: {
    id: string
  }
  swr: {
    delOneWorkspace: Function
  }
}

/**
 * Errors (delete)
 */
const errors = {
  delError: 'Unable to delete the workspace'
}

/**
 * Delete workspace
 * @param props Props
 */
const Delete = ({ workspace, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On delete
   */
  const onDelete = async (): Promise<void> => {
    setLoading(true)
    try {
      // Delete
      await WorkspaceAPI.del({ id: workspace.id })

      // Mutate
      swr.delOneWorkspace({ id: workspace.id })
    } catch (err) {
      ErrorNotification(errors.delError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <DeleteButton
      bordered
      loading={loading}
      text="The projects contained in this workspace will be lost."
      onDelete={onDelete}
    />
  )
}

Delete.propTypes = {
  workspace: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.shape({
    delOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
