/** @module Components.Editor */

import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import {
  Layout,
  Menu,
  Space,
  Button,
  Typography,
  Divider,
  Tooltip,
  notification
} from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'

import EditorProvider from '@/context/editor'

import { GoBack } from '@/components/assets/button'

import Loading from '@/components/loading'

import UserAPI from '@/api/user'

import StatusSteps from './steps'
import Blobs from './blobs'
import New from './new'
import Browser from './browser'
import Save from './save'
import Code from './code'

import { globalStyle } from '@/styles'
import style from './index.style'

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

  // Beta version message
  useEffect(() => {
    notification.warning({
      message: 'This is a beta version',
      description: (
        <>
          <br />
          - You may encounter unexpected bugs
          <br />- Some features are not totally functionnal
        </>
      ),
      placement: 'top',
      duration: 0
    })
  }, [])

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
      <Layout css={style.editor}>
        <Layout.Sider theme="light" width="256">
          <div css={globalStyle.logo}>
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
                type: 'divider'
              }
            ]}
          />

          <StatusSteps setName={setName} />
          <Divider />
          <Blobs />
        </Layout.Sider>

        <Layout.Content css={globalStyle.noScroll}>
          <Layout.Header css={style.header}>
            <div>
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
