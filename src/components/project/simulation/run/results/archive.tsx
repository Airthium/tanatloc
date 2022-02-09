import { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import { Error as ErrorNotification } from '@/components/assets/notification'

import ResultAPI from '@/api/result'

import { ISimulation } from '@/database/index.d'

export interface IProps {
  simulation: ISimulation
}

const errors = {
  archive: 'Unable to download the archive'
}

/**
 * Archive
 * @param props Props
 */
const Archive = ({ simulation }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On archive
   */
  const onArchive = async () => {
    setLoading(true)

    try {
      const archive = await ResultAPI.archive({ id: simulation.id })
      const content = await archive.blob()

      const url = window.URL.createObjectURL(new Blob([content]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', simulation.scheme.name + '.zip')
      link.click()
    } catch (err) {
      ErrorNotification(errors.archive, err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <Tooltip title="Download archive">
      <Button
        loading={loading}
        icon={<DownloadOutlined />}
        onClick={onArchive}
      />
    </Tooltip>
  )
}

export default Archive
