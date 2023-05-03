/** @module Components.Assets.Notification.Error */

import { Alert, Form, Typography } from 'antd'

import { APIError } from '@/api/error'

/**
 * Props
 */
export interface IProps {
  error: APIError
}

/**
 * Form error
 * @param props Props
 * @returns FormError
 */
const FormError = ({ error }: IProps): JSX.Element | null => {
  return error ? (
    <Form.Item>
      <Alert
        message={error.render ?? error.title}
        type={error.type}
        showIcon
        description={
          error.err && (
            <>
              {error.err.message && (
                <Typography.Text type="danger">
                  Message: <code>{error.err.message}</code>
                </Typography.Text>
              )}

              {error.err.status && (
                <>
                  <br />
                  <Typography.Text type="danger">
                    Status: <code>{error.err.status}</code>
                  </Typography.Text>
                </>
              )}
              {error.err.info?.message && (
                <>
                  <br />
                  <Typography.Text type="danger">
                    Information: <code>{error.err.info?.message}</code>
                  </Typography.Text>
                </>
              )}
            </>
          )
        }
      />
    </Form.Item>
  ) : null
}

export default FormError
