import { Card, Layout } from 'antd'

const Send = () => {
  return (
    <Layout>
      <Card bordered={false} className="Signup">
        A validation email has been send at your email address. Please follow
        the link.
      </Card>
    </Layout>
  )
}

export default Send
