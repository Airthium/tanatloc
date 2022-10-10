/** @module Components.Project.Simulation.Run.Results.Archive */

import { useState } from 'react'

import { DownloadButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import { IFrontSimulationsItem } from '@/api/index.d'
import ResultAPI from '@/api/result'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
}

/**
 * Errors
 */
export const errors = {
  archive: 'Unable to download archive'
}

/**
 * On archive
 */
export const onArchive = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
) => {
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
  }
}

/**
 * Archive
 * @param props Props
 * @returns Archive
 */
const Archive = ({ simulation }: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <DownloadButton
      loading={loading}
      onDownload={async () => {
        setLoading(true)
        try {
          await onArchive(simulation)
        } catch (err) {
        } finally {
          setLoading(false)
        }
      }}
    />
  )
}

export default Archive
