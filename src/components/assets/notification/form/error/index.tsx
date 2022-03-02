/** @module Components.Assets.Notification.Error */

import { Card, Typography } from 'antd'

import { ICallError } from '@/api/index.d'

/**
 * Props
 */
export interface IProps {
  error: { title: string; err?: ICallError }
  className?: string
}

/**
 * Form error
 * @param title Title
 * @param err Error
 * @returns FormError
 */
const FormError = ({ error, className }: IProps): JSX.Element => {
  return error ? (
    <Card
      size="small"
      className={className}
      style={{ backgroundColor: 'rgba(255, 0, 0, 0.15)', borderColor: 'red' }}
    >
      <Typography.Text strong type="danger">
        {error.title}
      </Typography.Text>
      {error.err && (
        <Card size="small">
          <Typography.Text type="danger" code={true}>
            Error message: {error.err.message}
          </Typography.Text>

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
                Description: {error.err.info?.message}
              </Typography.Text>
            </>
          )}
        </Card>
      )}
    </Card>
  ) : null
}

export default FormError
