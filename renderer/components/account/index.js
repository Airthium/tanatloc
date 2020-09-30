/** @module renderer/components/account */

import { Card, Layout, PageHeader, Typography, Divider, Tabs, Space } from 'antd'

import Information from './information'
import Password from './password'
import Delete from './delete'

/**
 * Account
 */
const Account = () => {
  /**
   * Render
   */
  return (
    <Layout className="Account Workspace no-scroll">
      <PageHeader
        backIcon={false}
        title={
          <Typography.Title level={4} className="pageheader-name">Account Settings</Typography.Title>
        }
        footer={
          <div>
            <Divider className="Welcome-divider" />
          </div>
        }
      />
      <Layout.Content className="scroll">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Personal Information" key="1">
          <Space direction="vertical" style={{width:'100%'}}>
            <Information />
            <Delete />
          </Space>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Security" key="2">
          <Password />
        </Tabs.TabPane>
        <Tabs.TabPane tab="HPC Providers" key="3">
        </Tabs.TabPane>
      </Tabs>
      </Layout.Content>
    </Layout>
  )
}

export default Account
