/** @module Components.Doc.Editor */

import { Typography } from 'antd'

import style from '../index.style'

/**
 * Editor
 * @returns Editor
 */
const Editor = (): JSX.Element => {
  return (
    <>
      <Typography.Title level={4}>Model Editor</Typography.Title>

      <Typography css={style.text}>
        <Typography.Text>Documentation is coming...</Typography.Text>
      </Typography>
    </>
  )
}

export default Editor
