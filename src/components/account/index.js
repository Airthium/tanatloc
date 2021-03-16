/** @module components/account */

import { useRouter } from 'next/router'
import { Layout, PageHeader, Typography, Divider, Tabs } from 'antd'

import Information from './information'
import Password from './password'
import Delete from './delete'
import HPC from './hpc'

/**
 * Account
 */
const Account = () => {
  // Data
  const router = useRouter()
  const { tab } = router.query

  /**
   * On change
   * @param {string} key Key
   */
  const onChange = (key) => {
    router.replace({
      pathname: '/dashboard',
      query: { page: 'account', tab: key }
    })
  }

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
        <Tabs defaultActiveKey={tab || 'personal'} onChange={onChange}>
          <Tabs.TabPane tab="Personal Information" key="personal">
            <Information />
            <Delete />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Security" key="security">
            <Password />
          </Tabs.TabPane>
          <Tabs.TabPane tab="HPC Providers" key="hpc">
            <HPC />
          </Tabs.TabPane>
        </Tabs>
      </Layout.Content>
    </Layout>
  )
}

export default Account
