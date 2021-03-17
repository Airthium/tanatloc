/** @module components/account */

import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Layout, PageHeader, Typography, Divider, Tabs, Space } from 'antd'

import Information from './information'
import Password from './password'
import Delete from './delete'
import HPC from './hpc'

/**
 * Account
 * @param {Object} props Props
 */
const Account = ({ user, swr }) => {
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
            <Space direction="vertical">
              <Information user={user} swr={{ mutateUser: swr.mutateUser }} />
              <Delete swr={{ mutateUser: swr.mutateUser }} />
            </Space>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Security" key="security">
            <Password user={user} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="HPC Providers" key="hpc">
            <HPC user={user} />
          </Tabs.TabPane>
        </Tabs>
      </Layout.Content>
    </Layout>
  )
}

Account.propTypes = {
  user: PropTypes.object.isRequired,
  swr: PropTypes.object.isRequired
}

export default Account
