import PropTypes from 'prop-types'
import { notification, Typography } from 'antd'

import Sentry from '@/lib/sentry'

/**
 * Error
 * @memberof module:components/assets/notification
 * @param {string} title Title
 * @param {Object} err Error
 */
const Error = (title, err) => {
  notification.error({
    message: title,
    description: <Typography.Text code={true}>{err.message}</Typography.Text>
  })
  console.error(err)
  Sentry.captureException(err)
}

Error.propTypes = {
  title: PropTypes.string.isRequired,
  err: PropTypes.object.isRequired
}

export default Error
