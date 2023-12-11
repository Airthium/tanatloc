/** @module Components.Assets.Notification.Success */

import { useContext } from 'react'
import { App } from 'antd'

import { NotificationContext } from '@/context/notification'
import { removeSuccess } from '@/context/notification/actions'

import useCustomEffect from '@/components/utils/useCustomEffect'

/**
 * Success notification
 * @returns SuccessNotification
 */
const SuccessNotification: React.FunctionComponent = () => {
  // Context
  const { success, dispatch } = useContext(NotificationContext)

  // Notification
  const { notification } = App.useApp()

  // Notifications
  useCustomEffect(
    () => {
      success?.forEach((success) => {
        notification.success({
          message: success.title,
          description: success.description,
          duration: 10
        })
        dispatch(removeSuccess(success))
      })
    },
    [notification, success],
    [dispatch]
  )

  return null
}

export default SuccessNotification
