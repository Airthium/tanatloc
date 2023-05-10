/** @module Components.Assets.PageHeader */

import { Divider } from 'antd'

import style from './index.module.css'

/**
 * Props
 */
export interface IProps {
  className?: string
  title?: string | React.JSX.Element
  footer?: string | React.JSX.Element
  extra?: string | React.JSX.Element
  children?: React.JSX.Element | React.JSX.Element[]
}

/**
 * Page header
 * @param props Props
 * @returns PageHeader
 */
const PageHeader = ({
  className,
  title,
  footer,
  extra,
  children
}: IProps): React.JSX.Element => {
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
