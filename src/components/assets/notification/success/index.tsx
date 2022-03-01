/** @module Components.Assets.Notification.Success */

import PropTypes from 'prop-types'
import { notification } from 'antd'

/**
 * Success notification
 * @param title Title
 * @param subTitle Sub title
 * @returns SuccessNotification
 */
const Success = (title: string, subTitle?: string): void => {
  notification.success({
    message: title,
    description: subTitle,
    duration: 10,
    style: {
      boxShadow:
        '0 3px 6px -4px rgb(0 255 0 / 12%), 0 6px 16px 0 rgb(0 255 0 / 8%), 0 9px 28px 8px rgb(0 255 0 / 5%)'
    }
  })
}

Success.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string
}

export default Success
