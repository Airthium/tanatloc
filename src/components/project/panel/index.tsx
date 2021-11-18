import PropTypes from 'prop-types'
import { ReactChild } from 'react'
import { Button, Card } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

interface IProps {
  visible: boolean
  title: string
  children: ReactChild | ReactChild[]
  onClose: Function
}

/**
 * Panel
 * @memberof Components.Project
 * @param {Object} props Props `{ visible, title, children onClose }`
 */
const Panel = ({ visible, title, children, onClose }: IProps): JSX.Element => {
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

Panel.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.element,
    PropTypes.string
  ]),
  onClose: PropTypes.func.isRequired
}

export default Panel
