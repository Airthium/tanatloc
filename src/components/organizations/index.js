/** @module components/organizations */

import { Divider, Layout, PageHeader, Typography } from 'antd'

import Add from './add'
import List from './list'

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
        <Add />
        <List />
      </Layout.Content>
    </Layout>
  )
}

export default Organizations
