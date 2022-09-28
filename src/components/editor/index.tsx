/** @module Components.Editor */

import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import { Layout, Menu, Space, Button, Typography, Divider } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'

import { DeleteButton, GoBack } from '@/components/assets/button'

import UserAPI from '@/api/user'

import EditorProvider from '@/context/editor'

import StatusSteps from './steps'
import Blobs from './blobs'
import New from './new'
import Load from './load'
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
  const [user, { loadingUser }] = UserAPI.useUser()

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
                <Load />
                <Save />
                <Button icon={<ShareAltOutlined />} />
                <DeleteButton
                  bordered
                  onDelete={async () => console.log('delete')}
                />
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
