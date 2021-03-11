import { Layout, Typography } from 'antd'

function Error({ statusCode }) {
  return (
    <Layout>
      <Layout.Content className="NotFound">
        {statusCode && (
          <Typography.Title level={1}>{statusCode}</Typography.Title>
        )}
        <Typography.Title level={1}>
          {statusCode
            ? 'An error occurred on server'
            : 'An error occurred on client'}
        </Typography.Title>
        <Typography.Title
          level={2}
          underline={true}
          onClick={document.location.reload}
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
