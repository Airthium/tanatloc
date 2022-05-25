/** @module Components.Error */

import { NextPageContext } from 'next'
import { Layout, Typography } from 'antd'

/**
 * Props
 */
export interface IProps {
  statusCode?: number
}

/**
 * Error page
 * @param props Props
 * @return Error
 */
function Error({ statusCode }: IProps): JSX.Element {

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content className="NotFound">
        {statusCode && (
          <Typography.Title level={1}>{statusCode}</Typography.Title>
        )}
        <Typography.Title level={1}>
          {statusCode === 100 ? 'An error occurred while installing the application ' : 'An error occurred while loading server'}
        </Typography.Title>
        <Typography.Title
          level={2}
          underline={true}
        >
          Please, try to run the application again.
        </Typography.Title>
      </Layout.Content>
    </Layout>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  if (res) return { statusCode: res.statusCode }
  else if (err) return { statusCode: err.statusCode }
  else return { statusCode: 404 }
}

export default Error
