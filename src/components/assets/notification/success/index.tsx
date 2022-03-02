/** @module Components.Assets.Notification.Success */

import PropTypes from 'prop-types'
import { notification } from 'antd'

/**
 * Success notification
 * @param title Title
 * @param subTitle Sub title
 * @returns SuccessNotification
 */
const SuccessNotification = (title: string, subTitle?: string): void => {
  notification.success({
    message: title,
    description: subTitle,
    duration: 10
  })
}

SuccessNotification.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string
}

export default SuccessNotification
