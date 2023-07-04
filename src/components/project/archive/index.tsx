/** @module Components.Project.Archive */

import { Dispatch, useCallback, useContext, useState } from 'react'
import { Button, Form, Tooltip, Typography, Upload, UploadFile } from 'antd'
import { HddOutlined, ImportOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import Dialog from '@/components/assets/dialog'
import { DeleteButton } from '@/components/assets/button'

import {
  IFrontMutateProjectsItem,
  IFrontMutateWorkspacesItem,
  IFrontProjectsItem,
  IFrontWorkspacesItem
} from '@/api/index.d'
import ProjectAPI from '@/api/project'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  workspace: Pick<IFrontWorkspacesItem, 'id'>
  project: Pick<IFrontProjectsItem, 'id' | 'archived' | 'title'>
  swr: {
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
    mutateOneProject: (project: IFrontMutateProjectsItem) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  archive: 'Unable to archive project',
  unarchiveServer: 'Unable to unarchive project on server',
  deleteArchive: 'Unable to delete archive',
  badFormat: 'Bad archive format (supported format: .tanatlocarchive)',
  upload: 'Unable to upload archive'
}

/**
 * On archive
 * @param workspace Workspace
 * @param project Project
 * @pram swr SWR
 */
export const _onArchive = async (
  workspace: Pick<IFrontWorkspacesItem, 'id'>,
  project: Pick<IFrontProjectsItem, 'id'>,
  swr: {
    mutateOneProject: (project: IFrontMutateProjectsItem) => Promise<void>
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
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
    await swr.mutateOneProject({
      ...project,
      archived: true
    })

    // Mutate workspace
    await swr.mutateOneWorkspace(workspace)
  } catch (err: any) {
    dispatch(addError({ title: errors.archive, err }))
    throw err
  }
}

/**
 * Unarchive from server
 * @param workspace Workspace
 * @param project Project
 * @param swr SWR
 */
export const _onUnarchiveServer = async (
  workspace: Pick<IFrontWorkspacesItem, 'id'>,
  project: Pick<IFrontProjectsItem, 'id'>,
  swr: IProps['swr'],
  dispatch: Dispatch<INotificationAction>
) => {
  try {
    await ProjectAPI.unarchiveFromServer({ id: project.id })

    await swr.mutateOneProject({
      ...project,
      archived: false
    })

    // Mutate workspace
    await swr.mutateOneWorkspace(workspace)
  } catch (err: any) {
    dispatch(addError({ title: errors.unarchiveServer, err }))
    throw err
  }
}

/**
 * Delete archive
 * @param project Project
 */
export const _onArchiveDelete = async (
  project: Pick<IFrontProjectsItem, 'id'>,
  dispatch: Dispatch<INotificationAction>
) => {
  try {
    await ProjectAPI.deleteArchiveFile({ id: project.id })
  } catch (err: any) {
    dispatch(addError({ title: errors.deleteArchive, err }))
  }
}

/**
 * Read file
 * @param file File
 */
export const _getFile = async (file: Blob): Promise<any> => {
  const reader = new FileReader()
  return new Promise((resolve) => {
    reader.addEventListener('load', () => {
      resolve(reader.result)
    })
    reader.readAsArrayBuffer(file)
  })
}

/**
 * On upload
 * @param workspace Workspace
 * @param project Project
 * @param info Info
 * @param swr SWR
 */
export const _onUpload = async (
  workspace: Pick<IFrontWorkspacesItem, 'id'>,
  project: Pick<IFrontProjectsItem, 'id'>,
  info: UploadChangeParam<any>,
  swr: IProps['swr'],
  dispatch: Dispatch<INotificationAction>
): Promise<boolean> => {
  if (info.file.status === 'uploading') {
    return true
  }

  if (info.file.status === 'done') {
    try {
      // Archive
      const archive = await _getFile(info.file.originFileObj)

      // Unarchive
      await ProjectAPI.unarchiveFromFile(
        { id: project.id },
        Buffer.from(archive)
      )

      await swr.mutateOneProject({
        ...project,
        archived: false
      })

      // Mutate workspace
      await swr.mutateOneWorkspace(workspace)
    } catch (err: any) {
      dispatch(addError({ title: errors.upload, err }))
    }

    return false
  }

  return false
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
}: IProps): React.JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback((): void => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback((): void => setVisible(false), [])

  /**
   * On archive
   */
  const onArchive = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _onArchive(workspace, project, swr, dispatch)
      // Close
      setLoading(false)
      setVisible(false)
    } catch (err) {
      setLoading(false)
      throw err
    }
  }, [workspace, project, swr, dispatch])

  /**
   * On unarchive (from server)
   */
  const onUnarchiveServer = useCallback((): void => {
    ;(async () => {
      setLoading(true)
      try {
        await _onUnarchiveServer(workspace, project, swr, dispatch)

        setLoading(false)
        setVisible(false)
      } catch (err) {
        setLoading(false)
      }
    })()
  }, [workspace, project, swr, dispatch])

  /**
   * On upload
   * @param info Info
   */
  const onUpload = useCallback(
    (info: UploadChangeParam<UploadFile<any>>): void => {
      ;(async () => {
        const load = await _onUpload(workspace, project, info, swr, dispatch)
        setLoading(load)
        setVisible(load)
      })()
    },
    [workspace, project, swr, dispatch]
  )

  /**
   * On archive delete
   */
  const onArchiveDelete = useCallback(
    async (): Promise<void> => _onArchiveDelete(project, dispatch),
    [project, dispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <Dialog
        visible={visible}
        loading={loading}
        title="Archive"
        onCancel={setVisibleFalse}
        onOk={project.archived ? undefined : onArchive}
        okButtonText="Archive"
      >
        {project.archived ? (
          <>
            <Form.Item
              label="Restore archive from the server"
              tooltip="This will restore the project from the server archive file."
            >
              <Button loading={loading} onClick={onUnarchiveServer}>
                Restore archive from the server
              </Button>
            </Form.Item>
            <Form.Item
              label="Restore archive from local file"
              tooltip="This will restore the project from your local archive file (.tanatlocarchive file)."
            >
              <Upload
                action={'/api/noop'}
                accept={'.tanatlocarchive'}
                showUploadList={false}
                onChange={onUpload}
              >
                <Button>Restore archive from archive file</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Delete archive from the server"
              tooltip="This will delete the archive file from the server, you will have to use a local copy to restore the project."
            >
              <DeleteButton
                loading={loading}
                bordered
                title="Delete server archive"
                text="Are you sure your want to delete the archive from the server?"
                onDelete={onArchiveDelete}
              >
                Delete server archive
              </DeleteButton>
            </Form.Item>
          </>
        ) : (
          <Typography.Text>
            An archive will be downloaded and the project will not be editable
            anymore, archive the project «{project.title}»?
          </Typography.Text>
        )}
      </Dialog>
      <Tooltip title={project.archived ? 'Manage archive' : 'Archive'}>
        <Button
          disabled={disabled}
          type="link"
          icon={project.archived ? <ImportOutlined /> : <HddOutlined />}
          onClick={setVisibleTrue}
        />
      </Tooltip>
    </>
  )
}

export default Archive
