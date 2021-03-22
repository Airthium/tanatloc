/** @module components/project/panel */

import PropTypes from 'prop-types'
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

Panel.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.object,
  onClose: PropTypes.func.isRequired
}

export default Panel
