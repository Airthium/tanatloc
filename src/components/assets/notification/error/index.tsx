/** @module Components.Assets.Notification.Error */

import { useCallback, useContext, useState } from 'react'
import { App, Button, Collapse, Space, Typography } from 'antd'
import { v4 as uuid } from 'uuid'

import { NotificationContext } from '@/context/notification'
import { removeError } from '@/context/notification/actions'

import useCustomEffect from '@/components/utils/useCustomEffect'

import Sentry from '@/lib/sentry'

/**
 * Error notification
 * @return ErrorNotification
 */
const ErrorNotification: React.FunctionComponent = () => {
  // State
  const [opened, setOpened] = useState<string[]>([])

  // Context
  const { errors, dispatch } = useContext(NotificationContext)

  // Notification
  const { notification } = App.useApp()

  /**
   * On close
   * @param key Key
   */
  const onClose = useCallback(
    (key: string): void => {
      console.log(opened)
      const index = opened.findIndex((open) => open === key)
      setOpened([...opened.slice(0, index), ...opened.slice(index + 1)])
    },
    [opened]
  )

  // Notifications
  useCustomEffect(
    () => {
      const currentOpened: string[] = [...opened]

      errors?.forEach((error) => {
        if (error.err?.message === 'Failed to fetch') {
          const key = 'server_error'

          if (currentOpened.includes(key)) return

          currentOpened.push(key)
          notification.error({
            key,
            message: 'Server error',
            description:
              'Server is disconnected, please check your internet connection.',
            duration: 0,
            onClose: () => onClose(key)
          })
        } else if (error.display === undefined || error.display) {
          const key = 'error_' + uuid()
          currentOpened.push(key)
          notification.error({
            key,
            message: error.title,
            description: error.err && (
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
            ),
            duration: 0,
            onClose: () => onClose(key)
          })
        }

        error.err && console.error(error.err)
        error.err && Sentry.captureException(error.err)

        dispatch(removeError(error))
      })

      setOpened(currentOpened)
    },
    [notification, errors],
    [opened, onClose, dispatch]
  )

  /**
   * Close all
   */
  const closeAll = useCallback((): void => {
    notification.destroy()
    setOpened([])
  }, [notification])

  // Close all
  useCustomEffect(
    () => {
      const key = 'close_all'
      if (opened.length > 1 && !opened.includes(key)) {
        notification.warning({
          key,
          message: 'Close all error notifications',
          description: <Button onClick={closeAll}>Close all</Button>,
          duration: 0,
          placement: 'top'
        })

        setOpened([...opened, key])
      }
    },
    [notification, opened],
    [closeAll]
  )

  return null
}

export default ErrorNotification
