/** @module Components.Project.Simulation.Run.Results.Download */

import { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import { ErrorNotification } from '@/components/assets/notification'

import { IFrontSimulationsItem, IFrontResult } from '@/api/index.d'
import ResultAPI from '@/api/result'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id'>
  file: Pick<IFrontResult, 'originPath' | 'name' | 'fileName'>
}

/**
 * Errors
 */
export const errors = {
  download: 'Unable to download the file'
}

/**
 * On download
 * @param simulation Simulation
 * @param file File
 */
const onDownload = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  file: Pick<IFrontResult, 'originPath' | 'name' | 'fileName'>
): Promise<void> => {
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
  }
}

/**
 * Download
 * @param props Props
 * @returns Download
 */
const Download = ({ simulation, file }: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <Tooltip title="Download">
      <Button
        loading={loading}
        icon={<DownloadOutlined />}
        onClick={async () => {
          setLoading(true)
          try {
            await onDownload(simulation, file)
          } catch (err) {
          } finally {
            setLoading(false)
          }
        }}
      />
    </Tooltip>
  )
}

export default Download
