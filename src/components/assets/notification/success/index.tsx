import PropTypes from 'prop-types'
import { notification } from 'antd'

/**
 * Success notification
 * @memberof Components.Assets.Notification
 * @param {string} title Title
 * @param {string} subTitle Sub title
 */
const Success = (title: string, subTitle?: string): void => {
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
