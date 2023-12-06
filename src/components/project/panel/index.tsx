/** @module Components.Project.Panel*/

import { ReactNode } from 'react'
import { Button, Card } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

import style from './index.module.css'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  title: string
  children?: ReactNode
  onClose: () => void
}

/**
 * Panel
 * @param props Props
 * @returns Panel
 */
const Panel = ({ visible, title, children, onClose }: IProps): ReactNode => {
  /**
   * Render
   */
  return (
    <Card
      className={style.panel}
      style={{ display: visible ? 'block' : 'none' }}
      title={title}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onClose} />}
    >
      {children}
    </Card>
  )
}

export default Panel
