import { useRouter } from 'next/router'
import { Layout, PageHeader, Tabs, Typography } from 'antd'

import Users from './users'
import Registration from './registration'

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
          <Tabs.TabPane tab="Users" key="users">
            <Users />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Registration" key="registration">
            <Registration />
          </Tabs.TabPane>
        </Tabs>
      </Layout.Content>
    </Layout>
  )
}

export default Administration
