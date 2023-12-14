/** @module Components.Assets.Notification.Error */

import { useCallback, useContext, useEffect, useRef } from 'react'
import { App, Button, Collapse, Space, Typography } from 'antd'
import { v4 as uuid } from 'uuid'

import { IErrorItem, NotificationContext } from '@/context/notification'
import { removeError } from '@/context/notification/actions'

import Sentry from '@/lib/sentry'

/**
 * Error notification
 * @return ErrorNotification
 */
const ErrorNotification: React.FunctionComponent = () => {
  // Ref
  const opened = useRef<string[]>([])

  // Context
  const { errors, dispatch } = useContext(NotificationContext)

  // Notification
  const { notification } = App.useApp()

  /**
   * On close
   * @param key Key
   */
  const onClose = useCallback((key: string): void => {
    const index = opened.current.findIndex((open) => open === key)
    opened.current = [
      ...opened.current.slice(0, index),
      ...opened.current.slice(index + 1)
    ]
  }, [])

  /**
   * Open server error notification
   */
  const openServerErrorNotification = useCallback(() => {
    const key = 'server_error'

    if (opened.current.includes(key)) return
    opened.current.push(key)

    notification.error({
      key,
      message: 'Server error',
      description:
        'Server is disconnected, please check your internet connection.',
      duration: 0,
      onClose: () => onClose(key)
    })
  }, [notification, onClose])

  /**
   * Open generic error notification
   * @param error Error
   */
  const openGenericErrorNotification = useCallback(
    (error: IErrorItem) => {
      const key = 'error_' + uuid()
      opened.current.push(key)

      notification.error({
        key,
        message: error.title,
        description: error.err ? (
          <>
            <Typography.Text code>{error.err.message}</Typography.Text>
            {(error.err.status || error.err.info) && (
              <Collapse
                items={[
                  {
                    key: 'information',
                    label: 'More information',
                    children: (
                      <Space direction="vertical">
                        {error.err.status && (
                          <Typography.Text>
                            Status: {error.err.status}
                          </Typography.Text>
                        )}
                        {error.err.info?.message && (
                          <Typography.Text>
                            Description: {error.err.info?.message}
                          </Typography.Text>
                        )}
                      </Space>
                    )
                  }
                ]}
              />
            )}
          </>
        ) : null,
        duration: 0,
        onClose: () => onClose(key)
      })
    },
    [notification, onClose]
  )

  /**
   * Open notification
   */
  const openNotification = useCallback(
    (error: IErrorItem) => {
      if (error.err?.message === 'Failed to fetch')
        openServerErrorNotification()
      else if (error.display === undefined || error.display)
        openGenericErrorNotification(error)
    },
    [openServerErrorNotification, openGenericErrorNotification]
  )

  // Notifications
  useEffect(() => {
    for (const error of errors ?? []) {
      openNotification(error)

      error.err && console.error(error.err)
      error.err && Sentry.captureException(error.err)

      dispatch(removeError(error))
    }
  }, [errors, openNotification, dispatch])

  /**
   * Close all
   */
  const closeAll = useCallback((): void => {
    notification.destroy()
    opened.current = []
  }, [notification])

  // Close all
  useEffect(() => {
    const key = 'close_all'
    if (opened.current.length > 1 && !opened.current.includes(key)) {
      notification.warning({
        key,
        message: 'Close all error notifications',
        description: <Button onClick={closeAll}>Close all</Button>,
        duration: 0,
        placement: 'top'
      })

      opened.current = [...opened.current, key]
    }
  })

  return null
}

export default ErrorNotification
