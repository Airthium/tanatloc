/** @module Components.Project.Archive */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button, Form, Tooltip, Typography } from 'antd'
import { HddOutlined, ImportOutlined } from '@ant-design/icons'

import { IProjectWithData, IWorkspaceWithData } from '@/lib/index.d'

import Dialog from '@/components/assets/dialog'
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
    mutateOneProject: (project: IProjectWithData) => void
  }
}

/**
 * Errors
 */
export const errors = {
  archive: 'Unable to archive project',
  unarchiveServer: 'Unable to unarchive project on server'
}

/**
 * On archive
 * @param workspace Workspace
 * @param project Project
 * @pram swr SWR
 */
export const onArchive = async (
  workspace: IWorkspaceWithData,
  project: IProjectWithData,
  swr: {
    mutateOneProject: (project: IProjectWithData) => void
    mutateOneWorkspace: (workspace: IWorkspaceWithData) => void
  }
): Promise<void> => {
  try {
    // API
    const archive = await ProjectAPI.archive({ id: project.id })
    const content = await archive.blob()

    // Download Folder
    const url = window.URL.createObjectURL(new Blob([content]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', project.id + '.tanatlocarchive')
    link.click()

    // Mutate project
    swr.mutateOneProject({
      ...project,
      archived: true
    })

    // Mutate workspace
    swr.mutateOneWorkspace(workspace)
  } catch (err) {
    ErrorNotification(errors.archive, err)
    throw err
  }
}

const onUnarchiveServer = async (workspace, project, swr) => {
  try {
    await ProjectAPI.unarchiveFromServer({ id: project.id })

    swr.mutateOneProject({
      ...project,
      archived: false
    })

    // Mutate workspace
    swr.mutateOneWorkspace(workspace)
  } catch (err) {
    ErrorNotification(errors.unarchiveServer, err)
  }
}

/**
 * Archive
 * @param props Props
 * @returns Archive
 */
const Archive = ({
  disabled,
  workspace,
  project,
  swr
}: IProps): JSX.Element => {
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
      <Dialog
        visible={visible}
        loading={loading}
        title="Archive"
        onCancel={() => setVisible(false)}
        onOk={
          !project.archived &&
          (async () => {
            setLoading(true)
            try {
              await onArchive(workspace, project, swr)
              // Close
              setLoading(false)
              setVisible(false)
            } catch (err) {
              setLoading(false)
              throw err
            }
          })
        }
        okButtonText="Archive"
      >
        {project.archived ? (
          <>
            <Form.Item>
              <Button danger>Delete archive from the server</Button>
            </Form.Item>
            <Form.Item>
              <Button
                onClick={async () => {
                  setLoading(true)
                  await onUnarchiveServer(workspace, project, swr)
                  setLoading(false)
                }}
              >
                Restore archive from the server
              </Button>
            </Form.Item>
            <Form.Item>
              <Button>Restore archive from upload</Button>
            </Form.Item>
          </>
        ) : (
          <Typography.Text>
            An archive will be downloaded and the project will not be editable
            anymore, archive the project «{project.title}»?
          </Typography.Text>
        )}
      </Dialog>
      <Tooltip title={project.archived ? 'Restore' : 'Archive'}>
        <Button
          disabled={disabled}
          type="link"
          icon={project.archived ? <ImportOutlined /> : <HddOutlined />}
          onClick={() => setVisible(true)}
        />
      </Tooltip>
    </>
  )
}

Archive.propTypes = {
  disabled: PropTypes.bool,
  workspace: PropTypes.exact({
    id: PropTypes.string.isRequired
  }).isRequired,
  project: PropTypes.exact({
    archived: PropTypes.bool,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneWorkspace: PropTypes.func.isRequired,
    mutateOneProject: PropTypes.func.isRequired
  }).isRequired
}

export default Archive
