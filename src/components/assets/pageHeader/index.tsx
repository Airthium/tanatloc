import { SerializedStyles } from '@emotion/react'
import { Divider } from 'antd'

import style from './index.style'

/**
 * Props
 */
export interface IProps {
  css?: SerializedStyles
  title?: string | JSX.Element
  footer?: string | JSX.Element
  extra?: string | JSX.Element
  children?: JSX.Element | JSX.Element[]
}

/**
 * Page header
 * @param props Props
 * @returns PageHeader
 */
const PageHeader = ({
  css,
  title,
  footer,
  extra,
  children
}: IProps): JSX.Element => {
  return (
    <div css={css}>
      {(title || extra) && (
        <div css={style.head}>
          <div>{title}</div>
          <div>{extra}</div>
        </div>
      )}
      <div>{children}</div>
      {footer || <Divider css={style.divider} />}
    </div>
  )
}

export default PageHeader
