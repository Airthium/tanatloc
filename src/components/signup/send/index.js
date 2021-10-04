import { Card, Layout } from 'antd'

/**
 * Signup send
 * @memberof Components.Signup
 */
const Send = () => {
  /**
   * Render
   */
  return (
    <Layout>
      <Card bordered={true} className="Signup">
        A validation email has been send at your email address. Please follow
        the link.
      </Card>
    </Layout>
  )
}

export default Send
