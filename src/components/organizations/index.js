/** @module components/organizations */

import { Divider, Layout, PageHeader, Space, Typography } from 'antd'

import Add from './add'
import List from './list'

/**
 * Organizations
 */
const Organizations = () => {
  return (
    <Layout className="Workspace">
      <PageHeader
        backIcon={false}
        title={
          <Typography.Title level={2} className="pageheader-name">
            Organizations
          </Typography.Title>
        }
        footer={
          <div>
            <Divider className="Tanatloc-divider" />
          </div>
        }
      />
      <Layout.Content>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Add />
          <List />
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Organizations
