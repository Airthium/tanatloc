import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Tooltip, Typography } from 'antd'
import { HddOutlined, ImportOutlined } from '@ant-design/icons'

import { IProjectWithData, IWorkspaceWithData } from '@/lib'

import Dialog from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import ProjectAPI from '@/api/project'

interface IProps {
  disabled?: boolean
  workspace: IWorkspaceWithData
  project: IProjectWithData
  swr: {
    mutateOneWorkspace: Function
    mutateOneProject: Function
  }
}

/**
 * Errors (archive)
 */
const errors = {
  archive: 'Unable to archive project'
}

/**
 * Archive
 * @memberof Components.Project
 * @param props Props
 */
const Archive = ({
  disabled,
  workspace,
  project,
  swr
}: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  const onArchive = async (): Promise<void> => {
    setLoading(true)
    try {
      // API
      const archive = await ProjectAPI.archive({ id: project.id })
      const content = await archive.blob()

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

      // Close
      setLoading(false)
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.archive, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Dialog
        visible={visible}
        closable={false}
        loading={loading}
        title="Archive"
        onCancel={() => setVisible(false)}
        onOk={onArchive}
        okButtonText="Archive"
      >
        <Typography.Text>
          Archive the project «{project.title}»?
        </Typography.Text>
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
