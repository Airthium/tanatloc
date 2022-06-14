/** @module Components.Account */

import { NextRouter, useRouter } from 'next/router'
import { Layout, PageHeader, Typography, Divider, Tabs, Space } from 'antd'
import isElectron from 'is-electron'

import { IFrontUser, IFrontMutateUser } from '@/api/index.d'

import Information from './information'
import Password from './password'
import Delete from './delete'
import HPC from './hpc'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'email' | 'firstname' | 'lastname' | 'avatar'>
  swr: {
    mutateUser: (user: IFrontMutateUser) => void
    clearUser: () => void
  }
}

/**
 * On change
 * @param router Router
 * @param key Key
 */
export const onChange = (router: NextRouter, key: string): void => {
  router.replace({
    pathname: '/dashboard',
    query: { page: 'account', tab: key }
  })
}

/**
 * Account
 * @param props Props
 * @returns Account
 */
const Account = ({ user, swr }: IProps): JSX.Element => {
  // Data
  const router = useRouter()
  const { tab }: { tab?: string } = router.query

  /**
   * Render
   */
  return (
    <Layout className="inDashboard Account no-scroll">
      <PageHeader
        className="inDashboard-PageHeader"
        backIcon={false}
        title={
          <Typography.Title level={2} className="inDashboard-PageHeader-title">
            Account Settings
          </Typography.Title>
        }
        footer={<Divider />}
      />
      <Layout.Content className="no-scroll">
        <Tabs
          className="inDashboard-Tabs no-scroll"
          type="card"
          defaultActiveKey={tab || 'personal'}
          onChange={(key) => onChange(router, key)}
        >
          <Tabs.TabPane tab="Personal Information" key="personal">
            <Space direction="vertical" className="full-width" size={20}>
              <Information
                user={{
                  email: user.email,
                  firstname: user.firstname,
                  lastname: user.lastname,
                  avatar: user.avatar
                }}
                swr={{ mutateUser: swr.mutateUser }}
              />
              <Delete swr={{ clearUser: swr.clearUser }} />
            </Space>
          </Tabs.TabPane>
          {!isElectron() && (
            <Tabs.TabPane tab="Security" key="security">
              <Space direction="vertical" className="full-width" size={20}>
                <Password
                  user={{
                    email: user.email
                  }}
                />
              </Space>
            </Tabs.TabPane>
          )}
          <Tabs.TabPane className="no-scroll" tab="HPC Providers" key="hpc">
            <HPC />
          </Tabs.TabPane>
        </Tabs>
      </Layout.Content>
    </Layout>
  )
}

export default Account
