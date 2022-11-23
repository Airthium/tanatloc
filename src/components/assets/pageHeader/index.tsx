import { SerializedStyles } from '@emotion/react'
import { Divider } from 'antd'

import style from './index.style'

/**
 * Props
 */
export interface IProps {
  css?: SerializedStyles
  title: string | JSX.Element
  extra?: string | JSX.Element
}

/**
 * Page header
 * @param props Props
 * @returns PageHeader
 */
const PageHeader = ({ css, title, extra }: IProps): JSX.Element => {
  return (
    <div css={css}>
      <div css={style.head}>
        <div>{title}</div>
        <div>{extra}</div>
      </div>
      <div></div>
      <Divider css={style.divider} />
    </div>
  )
}

export default PageHeader
