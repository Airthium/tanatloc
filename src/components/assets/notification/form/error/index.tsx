/** @module Components.Assets.Notification.Error */

import { Alert, Form, Typography } from 'antd'

import { ICallError } from '@/api/index.d'

/**
 * Props
 */
export interface IProps {
  error: { title: string; err?: ICallError }
}

/**
 * Form error
 * @param title Title
 * @param err Error
 * @returns FormError
 */
const FormError = ({ error }: IProps): JSX.Element => {
  return error ? (
    <Form.Item>
      <Alert
        message={error.title}
        type="error"
        showIcon
        description={
          error.err && (
            <>
              {error.err.message && (
                <Typography.Text type="danger" code={true}>
                  Message: {error.err.message}
                </Typography.Text>
              )}

              {error.err.status && (
                <>
                  <br />
                  <Typography.Text type="danger">
                    Status: {error.err.status}
                  </Typography.Text>
                </>
              )}
              {error.err.info?.message && (
                <>
                  <br />
                  <Typography.Text type="danger">
                    Information: {error.err.info?.message}
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
