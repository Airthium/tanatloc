/** @module components/project/panel */

import PropTypes from 'prop-types'
import { Button, Card } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

/**
 * Panel
 * @param {Object} props Props
 */
const Panel = ({ visible, title, children, footer, onClose }) => {
  return (
    <Card
      className="Panel"
      title={title}
      extra={<Button icon={<CloseOutlined />} onClick={onClose} />}
      style={{ display: visible ? 'block' : 'none' }}
    >
      {children}
      {footer && <div className="Card-footer">{footer}</div>}
    </Card>
  )
}

Panel.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.element,
    PropTypes.string
  ]),
  footer: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.element,
    PropTypes.string
  ]),
  onClose: PropTypes.func.isRequired
}

export default Panel
