import { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import { Error as ErrorNotification } from '@/components/assets/notification'

import ResultAPI from '@/api/result'

import { ISimulation, ISimulationTaskFile } from '@/database/index.d'

export interface IProps {
  simulation: ISimulation
  file: ISimulationTaskFile
}

const errors = {
  download: 'Unable to download the file'
}

/**
 * Download
 * @param props Props
 */
const Download = ({ simulation, file }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On download
   */
  const onDownload = async (): Promise<void> => {
    setLoading(true)

    try {
      const content = await ResultAPI.download(
        { id: simulation.id },
        { originPath: file.originPath, fileName: file.fileName }
      )
      const blob = await content.blob()

      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        file.name + '.' + file.fileName.split('.').pop()
      )
      link.click()
    } catch (err) {
      ErrorNotification(errors.download, err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <Tooltip title="Download">
      <Button
        loading={loading}
        icon={<DownloadOutlined />}
        size="small"
        onClick={onDownload}
      />
    </Tooltip>
  )
}

export default Download
