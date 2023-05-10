/** @module Components.Project.Simulation.Run.Results.Archive */

import { useCallback, useState } from 'react'

import { IFrontSimulationsItem } from '@/api/index.d'

import { DownloadButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

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
export const _onArchive = async (
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
  } catch (err: any) {
    ErrorNotification(errors.archive, err)
  }
}

/**
 * Archive
 * @param props Props
 * @returns Archive
 */
const Archive = ({ simulation }: IProps): React.JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * On download
   */
  const onDownload = useCallback((): void => {
    ;(async () => {
      setLoading(true)
      try {
        await _onArchive(simulation)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    })()
  }, [simulation])

  /**
   * Render
   */
  return <DownloadButton loading={loading} onDownload={onDownload} />
}

export default Archive
