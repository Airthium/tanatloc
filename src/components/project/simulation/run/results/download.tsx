/** @module Components.Project.Simulation.Run.Results.Download */

import { Dispatch, useCallback, useContext, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import { IFrontSimulationsItem, IFrontResult } from '@/api/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

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
  download: 'Unable to download file'
}

/**
 * On download
 * @param simulation Simulation
 * @param file File
 */
const _onDownload = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  file: Pick<IFrontResult, 'originPath' | 'name' | 'fileName'>,
  dispatch: Dispatch<INotificationAction>
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
  } catch (err: any) {
    dispatch(addError({ title: errors.download, err }))
  }
}

/**
 * Download
 * @param props Props
 * @returns Download
 */
const Download = ({ simulation, file }: IProps): React.JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On click
   */
  const onClick = useCallback((): void => {
    ;(async () => {
      setLoading(true)
      try {
        await _onDownload(simulation, file, dispatch)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    })()
  }, [simulation, file, dispatch])

  /**
   * Render
   */
  return (
    <Tooltip title="Download">
      <Button loading={loading} icon={<DownloadOutlined />} onClick={onClick} />
    </Tooltip>
  )
}

export default Download
