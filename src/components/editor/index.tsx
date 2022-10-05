/** @module Components.Editor */

import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import { Layout, Menu, Space, Button, Typography, Divider, Tooltip } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'

import { GoBack } from '@/components/assets/button'
import Loading from '@/components/loading'

import UserAPI from '@/api/user'

import EditorProvider from '@/context/editor'

import StatusSteps from './steps'
import Blobs from './blobs'
import New from './new'
import Browser from './browser'
import Save from './save'
import Code from './code'

/**
 * Editor
 * @returns Editor
 */
const Editor = () => {
  // Sate
  const [name, setName] = useState<string>()

  // Data
  const router = useRouter()
  const [user, { loadingUser, mutateUser }] = UserAPI.useUser()

  // Not logged -> go to login page
  useEffect(() => {
    if (!loadingUser && !user) router.replace('/')
  }, [user, loadingUser, router])

  /**
   * Handle dashboard
   */
  const handleDashboard = useCallback(() => {
    router.push({
      pathname: '/dashboard'
    })
  }, [router])

  /**
   * Render
   */
  if (loadingUser || !user) return <Loading />
  return (
    <EditorProvider>
      <Layout className="Editor">
        <Layout.Sider theme="light" width="256">
          <div className="logo">
            <img src="/images/logo.svg" alt="Tanatloc" />
          </div>
          <Menu
            mode="inline"
            items={[
              {
                key: 'menu-go-back',
                disabled: true,
                style: { cursor: 'unset', margin: '10px 0', paddingLeft: 10 },
                label: (
                  <GoBack onClick={handleDashboard}>Return to dashboard</GoBack>
                )
              },
              {
                type: 'divider',
                className: 'Editor-Menu-Divider'
              }
            ]}
          />

          <StatusSteps setName={setName} />
          <Divider />
          <Blobs />
        </Layout.Sider>

        <Layout.Content className="no-scroll">
          <Layout.Header className="Editor-Header">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <Typography.Text strong>{name}</Typography.Text>
              <Space>
                <New />
                <Browser
                  user={{
                    id: user.id,
                    models: user.models,
                    templates: user.templates
                  }}
                  swr={{ mutateUser }}
                />
                <Save
                  user={{ id: user.id, models: user.models }}
                  swr={{ mutateUser }}
                />
                <Tooltip title="Coming soon">
                  <Button disabled icon={<ShareAltOutlined />} />
                </Tooltip>
              </Space>
            </div>
          </Layout.Header>

          <Code />
        </Layout.Content>
      </Layout>
    </EditorProvider>
  )
}

export default Editor
