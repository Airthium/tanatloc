/** @module Components.Assets.Notification.Error */

import PropTypes from 'prop-types'
import { Collapse, notification, Space, Typography } from 'antd'

import { ICallError } from '@/api/index.d'

import Sentry from '@/lib/sentry'

let serverError = false

/**
 * Error notification
 * @param title Title
 * @param err Error
 * @param display Display notification
 * @return ErrorNotification
 */
const ErrorNotification = (
  title: string,
  err?: ICallError,
  display: boolean = true
): void => {
  if (err?.message === 'Failed to fetch') {
    if (!serverError) {
      notification.error({
        message: 'Server error',
        description:
          'Server is disconnected, please check your internet connection.',
        duration: 0,
        onClose: () => {
          serverError = false
        }
      })
      serverError = true
    }
    return
  }

  display &&
    notification.error({
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
  err && console.error(err)
  err && Sentry.captureException(err)
}

ErrorNotification.propTypes = {
  title: PropTypes.string.isRequired,
  err: PropTypes.object,
  display: PropTypes.bool
}

export default ErrorNotification
