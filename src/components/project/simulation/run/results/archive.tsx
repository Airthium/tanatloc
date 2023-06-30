/** @module Components.Project.Simulation.Run.Results.Archive */

import { Dispatch, useCallback, useContext, useState } from 'react'

import { IFrontSimulationsItem } from '@/api/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { DownloadButton } from '@/components/assets/button'

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
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  dispatch: Dispatch<INotificationAction>
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
    dispatch(addError({ title: errors.archive, err }))
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

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On download
   */
  const onDownload = useCallback((): void => {
    ;(async () => {
      setLoading(true)
      try {
        await _onArchive(simulation, dispatch)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    })()
  }, [simulation, dispatch])

  /**
   * Render
   */
  return <DownloadButton loading={loading} onDownload={onDownload} />
}

export default Archive
