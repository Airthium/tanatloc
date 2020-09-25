import { Divider, Layout, PageHeader, Typography } from 'antd'

import Add from '../../workspace/add'

/**
 * Welcome
 * @memberof module:renderer/components/dashboard
 */
const Welcome = () => {
  return (
    <Layout>
      <Layout.Content className="Welcome no-scroll">
        <PageHeader
          backIcon={false}
          title={
            <Typography.Title level={2}>Welcome on board</Typography.Title>
          }
          footer={<Divider className="Welcome-divider" />}
        />
        <p>
          Select a workspace to start, or <Add />
        </p>
      </Layout.Content>
    </Layout>
  )
}

export default Welcome
