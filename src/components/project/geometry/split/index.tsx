/** @module Components.Project.Geometry.Split */

import { useCallback, useContext, useMemo, useState } from 'react'
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
export type Project = Pick<IFrontProject, 'id'>
export type Geometry = Pick<IFrontGeometriesItem, 'id' | 'summary'>
export interface IProps {
  project: Project
  geometry: Geometry
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
  project: Project,
  geometry: Geometry
): Promise<string> => {
  const { message } = await GeometryAPI.splitStep(project, geometry)
  return message
}

/**
 * Split
 * @param props Props
 * @returns Split
 */
const Split: React.FunctionComponent<IProps> = ({ project, geometry }) => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Disabled
  const disabled = useMemo(
    () => geometry.summary.dimension !== 3,
    [geometry.summary.dimension]
  )

  /**
   * On split
   */
  const onSplit = useCallback(() => {
    const aysncFunction = async () => {
      setLoading(true)
      try {
        const message = await _onSplit(project, geometry)
        message.length && dispatch(addError({ title: message }))
      } catch (err: any) {
        dispatch(addError({ title: errors.split, err }))
      } finally {
        setLoading(false)
      }
    }
    aysncFunction().catch(console.error)
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
