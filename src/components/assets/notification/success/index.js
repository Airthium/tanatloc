import PropTypes from 'prop-types'
import { notification } from 'antd'

/**
 * Success
 * @memberof Components.Assets.Notification
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
