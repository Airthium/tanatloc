/** @module Components.Doc.Dashboard.Editor */

import { ReactNode } from 'react'
import Link from 'next/link'
import { Typography } from 'antd'

import style from '../../index.module.css'

const Editor = (): ReactNode => {
  return (
    <>
      <Typography.Title level={4}>Model Editor</Typography.Title>

      <Typography className={style.text}>
        <Typography.Text className={style.warnings}>
          This is a beta version
        </Typography.Text>
        <Typography.Text>
          <Link href="/doc?section=editor">Model Editor documentation</Link>
        </Typography.Text>
      </Typography>
    </>
  )
}

export default Editor
