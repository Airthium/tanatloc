import PropTypes from 'prop-types'
import { Collapse, notification, Space, Typography } from 'antd'

import Sentry from '@/lib/sentry'

import { ICallError } from '@/api'

/**
 * Error notification
 * @memberof Components.Assets.Notification
 * @param title Title
 * @param err Error
 * @param display Display notification
 */
const Error = (
  title: string,
  err?: ICallError,
  display: boolean = true
): void => {
  display &&
    notification.error({
      message: title,
      description: err && (
        <>
          <Typography.Text code={true}>{err.message}</Typography.Text>
          {(err.status || err.info) && (
            <Collapse>
              <Collapse.Panel key="information" header="More information">
                <Space direction="vertical">
                  {err.status && (
                    <Typography.Text>Status: {err.status}</Typography.Text>
                  )}
                  {err.info && (
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
      duration: 10
    })
  err && console.error(err)
  err && Sentry.captureException(err)
}

Error.propTypes = {
  title: PropTypes.string.isRequired,
  err: PropTypes.object,
  display: PropTypes.bool
}

export default Error
