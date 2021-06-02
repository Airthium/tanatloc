import PropTypes from 'prop-types'
import { notification, Typography } from 'antd'

import Sentry from '@/lib/sentry'

/**
 * Error
 * @memberof module:components/assets/notification
 * @param {string} title Title
 * @param {Object} err Error
 * @param {bool?} display Display notification [default: true]
 */
const Error = (title, err, display = true) => {
  display &&
    notification.error({
      message: title,
      description: <Typography.Text code={true}>{err.message}</Typography.Text>,
      duration: 10
    })
  console.error(err)
  Sentry.captureException(err)
}

Error.propTypes = {
  title: PropTypes.string.isRequired,
  err: PropTypes.object.isRequired,
  display: PropTypes.bool
}

export default Error
