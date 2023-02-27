/** @module Components.Project.Panel*/

import { Button, Card } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'

import style from './index.style'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  title: string
  children?: React.ReactElement | React.ReactElement[]
  onClose: () => void
}

/**
 * Panel
 * @param props Props
 * @returns Panel
 */
const Panel = ({ visible, title, children, onClose }: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Card
      className={css([style.panel, { display: visible ? 'block' : 'none' }])}
      title={title}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onClose} />}
    >
      {children}
    </Card>
  )
}

export default Panel
