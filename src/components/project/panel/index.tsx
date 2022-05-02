/** @module Components.Project.Panel*/

import { Button, Card } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

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
      className="panel"
      bodyStyle={{
        maxHeight: 'calc(100vh - 65px)',
        overflow: 'auto',
        padding: 0
      }}
      title={title}
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => onClose()}
        />
      }
      style={{ display: visible ? 'block' : 'none' }}
    >
      {children}
    </Card>
  )
}

export default Panel
