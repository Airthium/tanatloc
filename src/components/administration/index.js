/** @module components/administration */

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Divider, Layout, PageHeader, Tabs, Typography } from 'antd'

import { Error } from '@/components/assets/notification'

import Users from './users'
// import Groups from './groups'
import Registration from './registration'

import UserAPI from '@/api/user'

/**
 * Tab items
 */
const tabItems = {
  users: {
    label: 'Users',
    key: 'users'
  },
  // groups: {
  //   label: 'Groups',
  //   key: 'groups'
  // },
  registration: {
    label: 'Registration',
    key: 'registration'
  }
}

/**
 * Errors
 */
const errors = {
  users: 'Users error'
}

/**
 * Administration
 */
const Administration = () => {
  // Data
  const router = useRouter()
  const { tab } = router.query

  const [users, { addOneUser, mutateOneUser, delOneUser, errorUsers }] =
    UserAPI.useUsers()

  // Users error
  useEffect(() => {
    if (errorUsers) Error(errors.users, errorUsers)
  }, [errorUsers])

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
        footer={
          <div>
            <Divider className="Tanatloc-divider" />
          </div>
        }
      />
      <Layout.Content>
        <Tabs defaultActiveKey={tab || 'default'} onChange={onChange}>
          <Tabs.TabPane tab={tabItems.users.label} key={tabItems.users.key}>
            <Users
              users={users}
              swr={{ addOneUser, mutateOneUser, delOneUser }}
            />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab={tabItems.groups.label} key={tabItems.groups.key}>
            <Groups users={users} />
          </Tabs.TabPane> */}
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
