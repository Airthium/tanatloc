import { useRouter } from 'next/router'
import { Layout, Typography } from 'antd'

/**
 * Error page
 * @param {Object} props Props
 */
function Error({ statusCode }) {
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
          level={2}
          underline={true}
          onClick={router.reload}
          style={{ cursor: 'pointer' }}
        >
          Please, refresh the page
        </Typography.Title>
      </Layout.Content>
    </Layout>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
