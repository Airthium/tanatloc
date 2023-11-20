/** @module Components.Project.Geometry.Split */

import { ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { SplitCellsOutlined } from '@ant-design/icons'

import { IFrontGeometriesItem, IFrontProject } from '@/api/index.d'

import { addError } from '@/context/notification/actions'
import { NotificationContext } from '@/context/notification'

import GeometryAPI from '@/api/geometry'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface ISplitProps {
  project: Pick<IFrontProject, 'id'>
  geometry: Pick<IFrontGeometriesItem, 'id' | 'summary'>
}

// Errors
export const errors = {
  split: 'Unable to split geoemtry'
}

/**
 * On split
 * @param project Project
 * @param geometry Geometry
 */
const _onSplit = async (
  project: Pick<IFrontProject, 'id'>,
  geometry: Pick<IFrontGeometriesItem, 'id'>
): Promise<string> => {
  const { message } = await GeometryAPI.splitStep(project, geometry)
  return message
}

/**
 * Split
 * @param props Props
 * @returns Split
 */
const Split = ({ project, geometry }: ISplitProps): ReactNode => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Disabled
  const disabled = useMemo(
    () => geometry.summary.dimension !== 3,
    [geometry.summary.dimension]
  )

  // On split
  const onSplit = useCallback(() => {
    setLoading(true)
    _onSplit(project, geometry)
      .then((message) => {
        message.length && dispatch(addError({ title: message }))
      })
      .catch((err) => {
        dispatch(addError({ title: errors.split, err }))
      })
      .finally(() => setLoading(false))
  }, [project, geometry, dispatch])

  /**
   * Render
   */
  return (
    <Tooltip title="Split volumes">
      <Button
        disabled={disabled}
        loading={loading}
        className={globalStyle.noBorder}
        icon={<SplitCellsOutlined />}
        onClick={onSplit}
      />
    </Tooltip>
  )
}

export default Split
