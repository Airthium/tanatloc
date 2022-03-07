/** @module Components.Project.Simulation.Run.Results.Archive */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import { ErrorNotification } from '@/components/assets/notification'

import ResultAPI from '@/api/result'

import { ISimulation } from '@/database/index.d'

export interface IProps {
  simulation: ISimulation
}

const errors = {
  archive: 'Unable to download the archive'
}

/**
 * On archive
 */
const onArchive = async (simulation: ISimulation) => {
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
 */
const Archive = ({ simulation }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * Render
   */
  return (
    <Tooltip title="Download archive">
      <Button
        loading={loading}
        icon={<DownloadOutlined />}
        onClick={async () => {
          setLoading(true)
          try {
            await onArchive(simulation)
          } catch (err) {
          } finally {
            setLoading(false)
          }
        }}
      />
    </Tooltip>
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
