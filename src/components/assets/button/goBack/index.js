import PropTypes from 'prop-types'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

/**
 * Go back
 * @memberof Components.Assets.Button
 * @param {Object} props Props `{ children, onClick}`
 */
const GoBack = ({ children, onClick }) => {
  return (
    <Button
      icon={<ArrowLeftOutlined className="goback-button-icon" />}
      className="goback-button"
      size="large"
      onClick={onClick}
    >
      {children || 'Go back'}
    </Button>
  )
}

GoBack.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired
}

export default GoBack
