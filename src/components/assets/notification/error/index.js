import PropTypes from 'prop-types'
import { Collapse, notification, Space, Typography } from 'antd'

import Sentry from '@/lib/sentry'

/**
 * Error
 * @memberof module:components/assets/notification
 * @param {string} title Title
 * @param {Object?} err Error
 * @param {bool?} display Display notification [default: true]
 */
const Error = (title, err, display = true) => {
  display &&
    notification.error({
      message: title,
      description: err && (
        <>
          <Typography.Text code={true}>{err.message}</Typography.Text>
          {(err.status || error.info) && (
            <Collapse>
              <Collapse.Panel header="More information">
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
  err: PropTypes.object.isRequired,
  display: PropTypes.bool
}

export default Error
