import { useRouter } from 'next/router'
import { Layout, PageHeader, Tabs, Typography } from 'antd'

import Users from './users'
import Groups from './groups'
import Registration from './registration'

const tabItems = {
  users: {
    label: 'Users',
    key: 'users'
  },
  groups: {
    label: 'Groups',
    key: 'groups'
  },
  registration: {
    label: 'Registration',
    key: 'registration'
  }
}

/**
 * Administration
 */
const Administration = () => {
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
      query: { page: 'administration', tab: key }
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
            Administration
          </Typography.Title>
        }
      />
      <Layout.Content>
        <Tabs defaultActiveKey={tab || 'default'} onChange={onChange}>
          <Tabs.TabPane tab={tabItems.users.label} key={tabItems.users.key}>
            <Users />
          </Tabs.TabPane>
          <Tabs.TabPane tab={tabItems.groups.label} key={tabItems.groups.key}>
            <Groups />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={tabItems.registration.label}
            key={tabItems.registration.key}
          >
            <Registration />
          </Tabs.TabPane>
        </Tabs>
      </Layout.Content>
    </Layout>
  )
}

export default Administration
