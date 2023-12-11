/** @module Components.Doc.Editor */

import { Typography } from 'antd'

import style from '../index.module.css'

/**
 * Editor
 * @returns Editor
 */
const Editor: React.FunctionComponent = () => {
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
