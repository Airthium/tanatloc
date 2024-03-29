/** @module Components.Editor */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  Layout,
  Menu,
  Space,
  Button,
  Typography,
  Divider,
  Tooltip,
  Tour,
  TourProps
} from 'antd'
import { CaretRightOutlined } from '@ant-design/icons'

import EditorProvider from '@/context/editor'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'
import { GoBack } from '@/components/assets/button'

import Loading from '@/components/loading'

import UserAPI from '@/api/user'
import OrganizationAPI from '@/api/organization'

import StatusSteps from './steps'
import Blobs from './blobs'
import New from './new'
import Browser from './browser'
import Save from './save'
import Code from './code'
import Share from './share'
import AutoSave from './autoSave'
import Info from './info'

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

// Steps
const steps: TourProps['steps'] = [
  {
    title: 'New',
    description: 'Create your brand new script.',
    target: () => document.getElementById('new')!
  },
  {
    title: 'Code browser',
    description: 'Find one of your previous script or choose a predefined one.',
    target: () => document.getElementById('browser')!
  },
  {
    title: 'Save',
    description: 'Save your script so you can access it later.',
    target: () => document.getElementById('save')!
  },
  {
    title: 'Share',
    description: 'Share your template with groups and users',
    target: () => document.getElementById('share')!
  },
  {
    title: 'Auto-save',
    description:
      'Activate / desactivate automatic save and reload auto-saved code (Essential privacy policy must be activated)',
    target: () => document.getElementById('autoSave')!
  },
  {
    title: 'Steps',
    description:
      'It checks if you are doing correctly. Keep an eye on these steps to make sure everything is ok.',
    target: () => document.getElementById('steps')!
  },
  {
    title: 'Code',
    description:
      'Write your script here. You can find examples of working scripts by clicking the browse button on top of the JSON editor.'
  },
  {
    title: 'Blobs',
    description:
      'Are you struggling to write your script ? Find some predefined parts of code right here.',
    target: () => document.getElementById('blobs')!
  }
]

/**
 * Editor
 * @returns Editor
 */
const Editor: React.FunctionComponent = () => {
  // State
  const [name, setName] = useState<string>()
  const [tourOpened, setTourOpened] = useState<boolean>(false)

  // Data
  const router = useRouter()
  const [user, { loadingUser, mutateUser }] = UserAPI.useUser()
  const [organizations] = OrganizationAPI.useOrganizations()

  // Not logged -> go to login page
  useEffect(() => {
    asyncFunctionExec(async () => {
      if (!loadingUser && !user) await router.replace('/')
    })
  }, [user, loadingUser, router])

  /**
   * Open tour
   */
  const openTour = useCallback((): void => {
    setTourOpened(true)
  }, [])

  /**
   * Close tour
   */
  const closeTour = useCallback((): void => {
    setTourOpened(false)
  }, [])

  /**
   * Handle dashboard
   */
  const handleDashboard = useCallback((): void => {
    asyncFunctionExec(async () => {
      await router.push({
        pathname: '/dashboard'
      })
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
                <Info user={{ usermodels: user.usermodels }} />
                <Tooltip title="Start tour">
                  <Button icon={<CaretRightOutlined />} onClick={openTour} />
                </Tooltip>
                <New />
                <Browser
                  user={{
                    id: user.id,
                    usermodels: user.usermodels
                  }}
                  swr={{ mutateUser }}
                />
                <Save
                  user={{ id: user.id, usermodels: user.usermodels }}
                  swr={{ mutateUser }}
                />
                <Share
                  user={{ id: user.id, usermodels: user.usermodels }}
                  organizations={organizations}
                  swr={{ mutateUser }}
                />
                <AutoSave />
              </Space>
            </div>
          </Layout.Header>
          <Code />
          <Tour open={tourOpened} onClose={closeTour} steps={steps} />
        </Layout.Content>
      </Layout>
    </EditorProvider>
  )
}

export default Editor
