import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Tooltip, Typography } from 'antd'
import { HddOutlined, ImportOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import ProjectAPI from '@/api/project'

const errors = {
  archive: 'Unable to archive project'
}

const Archive = ({ disabled, workspace, project, swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const onArchive = async () => {
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
        okButtonProps={{ text: 'Archive' }}
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
    id: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired
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
