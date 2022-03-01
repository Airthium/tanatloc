/** @module Components.Account */

import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Layout, PageHeader, Typography, Divider, Tabs, Space } from 'antd'

import { IUserWithData } from '@/lib/index.d'

import Information from './information'
import Password from './password'
import Delete from './delete'
import HPC from './hpc'

export interface IProps {
  user: IUserWithData
  swr: {
    mutateUser: (user: IUserWithData) => void
  }
}

/**
 * Account
 * @param props Props
 *
 */
const Account = ({ user, swr }: IProps): JSX.Element => {
  // Data
  const router = useRouter()
  const { tab }: { tab?: string } = router.query

  /**
   * On change
   * @param key Key
   */
  const onChange = (key: string): void => {
    router.replace({
      pathname: '/dashboard',
      query: { page: 'account', tab: key }
    })
  }

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
          onChange={onChange}
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
              <Delete swr={{ mutateUser: swr.mutateUser }} />
            </Space>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Security" key="security">
            <Space direction="vertical" className="full-width" size={20}>
              <Password
                user={{
                  email: user.email
                }}
              />
            </Space>
          </Tabs.TabPane>
          <Tabs.TabPane className="no-scroll" tab="HPC Providers" key="hpc">
            <HPC />
          </Tabs.TabPane>
        </Tabs>
      </Layout.Content>
    </Layout>
  )
}

Account.propTypes = {
  user: PropTypes.exact({
    email: PropTypes.string.isRequired,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    avatar: PropTypes.object
  }).isRequired,
  swr: PropTypes.exact({
    mutateUser: PropTypes.func.isRequired
  }).isRequired
}

export default Account
