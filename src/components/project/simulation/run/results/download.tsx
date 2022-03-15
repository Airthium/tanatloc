/** @module Components.Project.Simulation.Run.Results.Download */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import { ErrorNotification } from '@/components/assets/notification'

import ResultAPI from '@/api/result'

import { ISimulation, ISimulationTaskFile } from '@/database/index.d'

/**
 * Props
 */
export interface IProps {
  simulation: ISimulation
  file: Omit<ISimulationTaskFile, 'type'>
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
  simulation: ISimulation,
  file: Omit<ISimulationTaskFile, 'type'>
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
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

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

Download.propTypes = {
  file: PropTypes.exact({
    originPath: PropTypes.string.isRequired,
    name: PropTypes.string,
    fileName: PropTypes.string.isRequired
  }),
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired
  })
}

export default Download
