/** @module Components.Assets.Notification.Error */

import { Button, Collapse, notification, Space, Typography } from 'antd'

import { ICallError } from '@/api/index.d'

import Sentry from '@/lib/sentry'

let serverNotification: string | undefined
const opened: string[] = []
let closeNotification: string | undefined

/**
 * Close all
 */
export const closeAll = () => {
  if (serverNotification) {
    notification.destroy(serverNotification)
    serverNotification = undefined
  }

  opened.forEach((notif) => notification.destroy(notif))
  opened.length = 0

  notification.destroy(closeNotification)
  closeNotification = undefined
}

/**
 * Error notification
 * @param title Title
 * @param err Error
 * @param display Display notification
 * @return ErrorNotification
 */
const ErrorNotification = (
  title: string,
  err?: ICallError | any,
  display: boolean = true
): void => {
  if (err?.message === 'Failed to fetch') {
    if (!serverNotification) {
      const key = 'server_error'
      opened.push(key)
      notification.error({
        key,
        message: 'Server error',
        description:
          'Server is disconnected, please check your internet connection.',
        duration: 0,
        onClose: () => {
          serverNotification = undefined
        }
      })
      serverNotification = key
    }
    return
  }

  if (display) {
    const key = 'error_' + opened.length
    opened.push(key)
    notification.error({
      key,
      message: title,
      description: err && (
        <>
          <Typography.Text code>{err.message}</Typography.Text>
          {(err.status || err.info) && (
            <Collapse>
              <Collapse.Panel key="information" header="More information">
                <Space direction="vertical">
                  {err.status && (
                    <Typography.Text>Status: {err.status}</Typography.Text>
                  )}
                  {err.info?.message && (
                    <Typography.Text>
                      Description: {err.info?.message}
                    </Typography.Text>
                  )}
                </Space>
              </Collapse.Panel>
            </Collapse>
          )}
        </>
      ),
      duration: 0
    })
  }
  err && console.error(err)
  err && Sentry.captureException(err)

  if (opened.length > 1 && !closeNotification) {
    const key = 'close_all'
    notification.info({
      key,
      message: (
        <Button type="primary" onClick={closeAll}>
          Close all
        </Button>
      ),
      description: 'Close all error notifications',
      duration: 0,
      placement: 'top'
    })
    closeNotification = key
  }
}

export default ErrorNotification
