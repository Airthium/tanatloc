/** @namespace Components.Account */

import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Layout, PageHeader, Typography, Divider, Tabs, Space } from 'antd'

import Information from './information'
import Password from './password'
import Delete from './delete'
import HPC from './hpc'

interface IProps {
  user: {
    email: string
    firstname?: string
    lastname?: string
    avatar?: Buffer
    authorizedplugins: string[]
  }
  swr: {
    mutateUser: Function
  }
}

/**
 * Account
 * @memberof Components.Account
 * @param {Object} props Props `{ user, swr }`
 */
const Account = ({ user, swr }: IProps): JSX.Element => {
  // Data
  const router = useRouter()
  const { tab }: { tab?: string } = router.query

  /**
   * On change
   * @param {string} key Key
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
            <Space direction="vertical" style={{ width: '100%' }}>
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
            <Space direction="vertical" style={{ width: '100%' }}>
              <Password
                user={{
                  email: user.email
                }}
              />
            </Space>
          </Tabs.TabPane>
          <Tabs.TabPane tab="HPC Providers" key="hpc">
            <HPC
              user={{
                authorizedplugins: user.authorizedplugins
              }}
            />
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
    avatar: PropTypes.object,
    authorizedplugins: PropTypes.array.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateUser: PropTypes.func.isRequired
  }).isRequired
}

export default Account
