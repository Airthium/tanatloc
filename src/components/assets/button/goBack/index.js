import PropTypes from 'prop-types'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

/**
 * Go back
 * @param {Object} props Props
 */
const GoBack = ({ onClick }) => {
  return (
    <Button
      icon={<ArrowLeftOutlined style={{ color: '#fad114' }} />}
      style={{ border: 'none' }}
      onClick={onClick}
    >
      Go back
    </Button>
  )
}

GoBack.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default GoBack
