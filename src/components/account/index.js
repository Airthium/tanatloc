/** @module renderer/components/account */

import { Layout, PageHeader, Typography, Divider, Tabs } from 'antd'

import Information from './information'
import Password from './password'
import Delete from './delete'
import HPC from './hpc'

/**
 * Account
 */
const Account = () => {
  /**
   * Render
   */
  return (
    <Layout className="Workspace">
      <PageHeader
        backIcon={false}
        title={
          <Typography.Title level={2} className="pageheader-name">
            Account Settings
          </Typography.Title>
        }
        footer={
          <div>
            <Divider className="Tanatloc-divider" />
          </div>
        }
      />
      <Layout.Content>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Personal Information" key="1">
            <Information />
            <Delete />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Security" key="2">
            <Password />
          </Tabs.TabPane>
          <Tabs.TabPane tab="HPC Providers" key="3">
            <HPC />
          </Tabs.TabPane>
        </Tabs>
      </Layout.Content>
    </Layout>
  )
}

export default Account
