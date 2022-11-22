/** @module Components.Account */

import { NextRouter, useRouter } from 'next/router'
import { Layout, Typography, Divider, Tabs, Space } from 'antd'

import isElectron from 'is-electron'

import { IFrontUser, IFrontMutateUser } from '@/api/index.d'

import Information from './information'
import Password from './password'
import Delete from './delete'
import HPC from './hpc'

const PageHeader = () => <div />

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

  const tabItems = []
  tabItems.push({
    key: 'personal',
    label: 'Personal Information',
    children: (
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
        {!isElectron() && <Delete swr={{ clearUser: swr.clearUser }} />}
      </Space>
    )
  })
  if (!isElectron())
    tabItems.push({
      key: 'security',
      label: 'Security',
      children: (
        <Space direction="vertical" className="full-width" size={20}>
          <Password
            user={{
              email: user.email
            }}
          />
        </Space>
      )
    })
  tabItems.push({
    key: 'hpc',
    label: 'HPC Providers',
    children: <HPC />
  })

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
          items={tabItems}
          defaultActiveKey={tab || 'personal'}
          onChange={(key) => onChange(router, key)}
        />
      </Layout.Content>
    </Layout>
  )
}

export default Account
