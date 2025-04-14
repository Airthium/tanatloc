/** @module Components.Account.HPC */

import {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
  ReactNode
} from 'react'
import { Card, Space, Spin } from 'antd'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'

import PluginsAPI from '@/api/plugins'

import Plugin from './plugin'

import globalStyle from '@/styles/index.module.css'

/**
 * Errors
 */
export const errors = {
  plugins: 'Unable to load plugins'
}

/**
 * Plugins list
 * @returns List
 */
export const _pluginsList = async () => {
  const plugins = await PluginsAPI.list()

  const HPCPlugins = plugins.filter((plugin) => plugin.category === 'HPC')

  if (HPCPlugins.length) {
    return HPCPlugins.map((plugin) => (
      <Card key={plugin.key} title={plugin.name}>
        <Plugin plugin={plugin} />
      </Card>
    ))
  } else {
    return (
      <Card title="No access">
        You do not have access to any HPC plugin. Request it.
      </Card>
    )
  }
}

/**
 * HPC plugins
 * @param props Props
 * @returns HPC
 */
const HPC: React.FunctionComponent = () => {
  // Ref
  const containerRef = useRef<HTMLDivElement>(null)

  // State
  const [list, setList] = useState<ReactNode>([
    <Card key="loading" title="Loading">
      <Spin />
    </Card>
  ])
  const [height, setHeight] = useState<number>(100)

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On resize
   */
  const onResize = useCallback(() => {
    const div = containerRef.current
    /* istanbul ignore next */
    if (!div) {
      setTimeout(() => onResize(), 100)
      return
    }

    const offsets = div.getBoundingClientRect()
    const top = offsets.top

    const totalHeight = window.innerHeight

    const newHeight = totalHeight - top

    if (newHeight !== height) setHeight(newHeight)
  }, [height])

  // Plugins list
  useEffect(() => {
    asyncFunctionExec(async () => {
      try {
        const newList = await _pluginsList()
        setList(newList)
      } catch (err: any) {
        dispatch(
          addError({
            title: errors.plugins,
            err
          })
        )
        setList(
          <Card key="error" title="Error">
            Something leads to an error. Please try again later.
          </Card>
        )
      }
    })
  }, [dispatch])

  // Height
  useEffect(() => {
    window.addEventListener('resize', onResize)
    onResize()
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  /**
   * Render
   */
  return (
    <Space
      ref={containerRef}
      direction="vertical"
      className={`${globalStyle.fullWidth} ${globalStyle.scroll}`}
      size={20}
      style={{ height: height - 20 }}
    >
      {list}
    </Space>
  )
}

export default HPC
