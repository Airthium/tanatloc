/** @module Components.Project.Simulation.Run.Results.Archive */

import { useCallback, useContext, useState } from 'react'

import { IFrontSimulationsItem } from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'
import { DownloadButton } from '@/components/assets/button'

import ResultAPI from '@/api/result'

/**
 * Props
 */
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export interface IProps {
  simulation: Simulation
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
export const _onArchive = async (simulation: Simulation) => {
  const archive = await ResultAPI.archive({ id: simulation.id })
  const content = await archive.blob()

  const url = window.URL.createObjectURL(new Blob([content]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', simulation.scheme.name + '.zip')
  link.click()
}

/**
 * Archive
 * @param props Props
 * @returns Archive
 */
const Archive: React.FunctionComponent<IProps> = ({ simulation }) => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On download
   */
  const onDownload = useCallback((): void => {
    asyncFunctionExec(async () => {
      setLoading(true)
      try {
        await _onArchive(simulation)
      } catch (err: any) {
        dispatch(addError({ title: errors.archive, err }))
      } finally {
        setLoading(false)
      }
    })
  }, [simulation, dispatch])

  /**
   * Render
   */
  return <DownloadButton loading={loading} onDownload={onDownload} />
}

export default Archive
