/** @module Components.Assets.PageHeader */

import { ReactNode } from 'react'
import { Divider } from 'antd'

import style from './index.module.css'

/**
 * Props
 */
export interface IProps {
  className?: string
  title?: ReactNode
  footer?: ReactNode
  extra?: ReactNode
  children?: ReactNode
}

/**
 * Page header
 * @param props Props
 * @returns PageHeader
 */
const PageHeader: React.FunctionComponent<IProps> = ({
  className,
  title,
  footer,
  extra,
  children
}) => {
  return (
    <div className={className}>
      {(title || extra) && (
        <div className={style.head}>
          <div>{title}</div>
          <div>{extra}</div>
        </div>
      )}
      <div>{children}</div>
      {footer ?? <Divider className={style.divider} />}
    </div>
  )
}

export default PageHeader
