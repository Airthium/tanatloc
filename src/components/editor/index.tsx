/** @module Components.Editor */

import { useRouter } from 'next/router'
import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { Layout, Steps, Menu, Space, Button, Form, Input } from 'antd'
import dynamic from 'next/dynamic'

import { DeleteButton, EditButton, GoBack } from '@/components/assets/button'

import UserAPI from '@/api/user'
import { SaveOutlined, ShareAltOutlined } from '@ant-design/icons'

const DynamicCodeEditor = dynamic(() => import('./code'), { ssr: false })

export interface IStep {
  title: string
  description: string
  status: 'wait' | 'process' | 'finish' | 'error'
}

const steps: IStep[] = [
  {
    title: 'Check title and description',
    description: 'Title, description, category, ...',
    status: 'wait'
  },
  {
    title: 'Check template format',
    description: 'EJS + FreeFEM',
    status: 'wait'
  },
  {
    title: 'Check description format',
    description: 'JSON',
    status: 'wait'
  },
  {
    title: 'Test template + description',
    description: 'Run template on Tanatloc server',
    status: 'wait'
  }
]

/**
 * Editor
 */
const Editor = () => {
  const [current, setCurrent]: [number, Dispatch<SetStateAction<number>>] =
    useState(-1)
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
  const handleDashboard = () => {
    router.push({
      pathname: '/dashboard'
    })
  }

  /**
   * On steps change
   * @param number Current step
   */
  const onStepsChange = (number: number): void => {
    setCurrent(number)
  }

  return (
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

        <Steps
          className="Editor-Steps"
          direction="vertical"
          current={current}
          onChange={onStepsChange}
        >
          {steps.map((step) => (
            <Steps.Step
              key={step.title}
              title={step.title}
              description={step.description}
              status={step.status}
            />
          ))}
        </Steps>
      </Layout.Sider>

      <Layout.Content className="no-scroll">
        <Layout.Header style={{ height: 'unset' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form>
              <Form.Item label="Name">
                <Input />
              </Form.Item>
              <Form.Item label="Description">
                <Input />
              </Form.Item>
            </Form>

            <Space>
              <EditButton bordered onEdit={() => {}} />
              <Button icon={<SaveOutlined />} />
              <Button icon={<ShareAltOutlined />} />
              <DeleteButton bordered onDelete={async () => {}} />
            </Space>
          </div>
        </Layout.Header>
        <DynamicCodeEditor />
      </Layout.Content>
    </Layout>
  )
}

export default Editor
