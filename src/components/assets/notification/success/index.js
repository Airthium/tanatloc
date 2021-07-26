import PropTypes from 'prop-types'
import { notification, Typography } from 'antd'

/**
 * Success
 * @memberof module:components/assets/notification
 * @param {string} title Title
 */
const Success = (title, subTitle) => {
  notification.success({
    message: title,
    description: subTitle,
    duration: 10
  })
}

Success.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string
}

export default Success
