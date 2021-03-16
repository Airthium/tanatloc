/** @module components/project/panel */

import { Button, Card } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

/**
 * Panel
 * @param {Object} props Props
 */
const Panel = ({ visible, title, children, onClose }) => {
  return (
    <Card
      className="Panel"
      title={title}
      extra={<Button icon={<CloseOutlined />} onClick={onClose} />}
      style={{ display: visible ? 'block' : 'none' }}
    >
      {children}
    </Card>
  )
}

export default Panel
