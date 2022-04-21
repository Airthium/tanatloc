/** @module Components.Project.Simulation.Run.Results.Archive */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'

import { DownloadButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import ResultAPI from '@/api/result'

import { ISimulation } from '@/database/simulation/index'

/**
 * Props
 */
export interface IProps {
  simulation: ISimulation
}

/**
 * Errors
 */
export const errors = {
  archive: 'Unable to download the archive'
}

/**
 * On archive
 */
export const onArchive = async (simulation: ISimulation) => {
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
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

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

Archive.propTypes = {
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  })
}

export default Archive
