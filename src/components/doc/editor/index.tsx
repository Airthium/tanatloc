/** @module Components.Doc.Editor */

import { ReactNode } from 'react'
import { Typography } from 'antd'

import style from '../index.module.css'

/**
 * Editor
 * @returns Editor
 */
const Editor = (): ReactNode => {
  return (
    <>
      <Typography.Title level={4}>Model Editor</Typography.Title>

      <Typography className={style.text}>
        <Typography.Text>Documentation is coming...</Typography.Text>
      </Typography>
    </>
  )
}

export default Editor
