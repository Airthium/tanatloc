import { notification, Typography } from 'antd'

import Sentry from '../../../../../src/lib/sentry'

const Error = (title, err) => {
  notification.error({
    message: title,
    description: <Typography.Text code={true}>{err.message}</Typography.Text>
  })
  console.error(err)
  Sentry.captureException(err)
}

export default Error
