/** @module Components.Assets.Notification.Success */

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

export default SuccessNotification
