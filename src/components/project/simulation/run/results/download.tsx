/** @module Components.Project.Simulation.Run.Results.Download */

import { useCallback, useContext, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import { IFrontSimulationsItem, IFrontResult } from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'

import ResultAPI from '@/api/result'

/**
 * Props
 */
export type Simulation = Pick<IFrontSimulationsItem, 'id'>
export type File = Pick<IFrontResult, 'originPath' | 'name' | 'fileName'>
export interface IProps {
  simulation: Simulation
  file: File
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
  simulation: Simulation,
  file: File
): Promise<void> => {
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
}

/**
 * Download
 * @param props Props
 * @returns Download
 */
const Download: React.FunctionComponent<IProps> = ({ simulation, file }) => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On click
   */
  const onClick = useCallback((): void => {
    asyncFunctionExec(async () => {
      setLoading(true)
      try {
        await _onDownload(simulation, file)
      } catch (err: any) {
        dispatch(addError({ title: errors.download, err }))
      } finally {
        setLoading(false)
      }
    })
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
