/** @module Components.Error */
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Layout, Typography } from 'antd'

export interface IProps {
  statusCode?: number
}

/**
 * Error page
 * @memberof Components.Error
 * @param {Object} props Props `{ statusCode }`
 */
function Error({ statusCode }: IProps): JSX.Element {
  // Router
  const router = useRouter()

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
          {statusCode ? 'An error occurred on server' : 'An error occurred'}
        </Typography.Title>
        <Typography.Title
          className="cursor-pointer"
          level={2}
          underline={true}
          onClick={router.reload}
        >
          Please, refresh the page
        </Typography.Title>
      </Layout.Content>
    </Layout>
  )
}

Error.getInitialProps = ({ res, err }) => {
  if (res) return { statusCode: res.statusCode }
  else if (err) return { statusCode: err.statusCode }
  else return { statusCode: 404 }
}

Error.propTypes = {
  statusCode: PropTypes.number
}

export default Error
