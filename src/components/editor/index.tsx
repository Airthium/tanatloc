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
import Joyride, { STATUS, Step } from 'react-joyride'

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

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'


/**
 * Editor
 * @returns Editor
 */
const Editor = () => {
  // State
  const [name, setName] = useState<string>()
  const [run, setRun] = useState(false)
  const [steps, setSteps] = useState([] as Step[])

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

  useEffect(() => {
    setSteps([
      {
        target: '#new',
        content: "Create your brand new script.",
        placement: 'bottom',
        disableBeacon:true
      },
      {
        target: '#browser',
        content: "Find one of your previous script or choose a premade one.",
        placement: 'bottom',
        disableBeacon:true
      },
      {
        target: '#save',
        content: "Save your script so you can access it later.",
        placement: 'bottom',
        disableBeacon:true
      },
      {
        target: '.editor_steps__8Zh42',
        content: "It checks if you are doing correctly. Keep an eye on these steps to make sure everything is ok.",
        placement: 'right-end',
        disableBeacon:true
      },
      {
        target: '.editor_code__MLS9F',
        content: "Write your script here. You can find examples of working scripts by clicking the browse button on top of the JSON editor.",
        placement: 'top-start',
        disableBeacon:true
      },
      {
        target: '#blobs',
        content: "Are you struggling to write your script ? Find some premade parts of code right here.",
        placement: 'top-start',
        disableBeacon:true
      }
    ])
  }, [])

  // Handle Joyride callback
  const handleJoyrideCallback = (data: any) => {
    const { status } = data

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false)
    }
  }

  // Start the tour
  const startTour = () => {
    setRun(true)
  }

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
      <Layout className={style.editor}>
        <Layout.Sider theme="light" width="256">
          <div className={globalStyle.logo}>
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

        <Layout.Content className={globalStyle.noScroll}>
          <Layout.Header className={style.header}>
            <div>
              <Typography.Text strong>{name}</Typography.Text>
              <Space>
                <Button onClick={startTour}>Start guide</Button>
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
          <Layout.Header className={style.header}>
            <div style={{ display: 'flex' }}>
              <h2 style={{ width: '50%' }}>FREEFEM EDITOR</h2>
              <h2 style={{ width: '50%', paddingInline: '50px' }}>
                JSON EDITOR
              </h2>
            </div>
          </Layout.Header>
          <Code />
          <Joyride
            steps={steps}
            run={run}
            callback={handleJoyrideCallback}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            styles={{
              options: {
                zIndex: 10000
              }
            }}
          />
        </Layout.Content>
      </Layout>
    </EditorProvider>
  )
}

export default Editor
