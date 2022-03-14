import { Layout, Typography } from 'antd'

const SafariIos = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Typography.Title level={3}>No manipulation needed</Typography.Title>
        <Typography>
          WebGL is supported by any version from iOS 8. If it doesn't work, try
          to update to a newer version.
        </Typography>
      </Layout.Content>
    </Layout>
  )
}

SafariIos.propTypes = {}

export default SafariIos
