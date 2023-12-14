/** @module Components.Assets.Notification.Success */

import { useCallback, useContext, useEffect } from 'react'
import { App } from 'antd'

import { ISuccessItem, NotificationContext } from '@/context/notification'
import { removeSuccess } from '@/context/notification/actions'

/**
 * Success notification
 * @returns SuccessNotification
 */
const SuccessNotification: React.FunctionComponent = () => {
  // Context
  const { success, dispatch } = useContext(NotificationContext)

  // Notification
  const { notification } = App.useApp()

  /**
   * Open notification
   * @param success Success
   */
  const openNotification = useCallback(
    (success: ISuccessItem) => {
      notification.success({
        message: success.title,
        description: success.description,
        duration: 10
      })
    },
    [notification]
  )

  // Notifications
  useEffect(() => {
    for (const s of success ?? []) {
      openNotification(s)
      dispatch(removeSuccess(s))
    }
  }, [success, openNotification, dispatch])

  return null
}

export default SuccessNotification
