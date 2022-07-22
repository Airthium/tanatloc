/** @module Components.Editor */

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import { Layout, Steps, Menu, Space, Button, Dropdown } from 'antd'
import { SaveOutlined, ShareAltOutlined } from '@ant-design/icons'

import { DeleteButton, EditButton, GoBack } from '@/components/assets/button'

import UserAPI from '@/api/user'

import Models from '@/models'
import Templates from '@/templates'

const DynamicCodeEditor = dynamic(() => import('./code'), { ssr: false })

export interface IStep {
  title: string
  description: string
  status: 'wait' | 'process' | 'finish' | 'error'
}

const steps: IStep[] = [
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
  // Sate
  const [stepsStatus, setStepsStatus] = useState<IStep['status'][]>([])
  const [model, setModel] = useState<string>()
  const [template, setTemplate] = useState<string>()

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

  const loadModel = ({ key }: { key: string }): void => {
    // Model
    const currentModel = Models[+key]
    setModel(JSON.stringify(currentModel, null, '  '))

    // Template
    const modelKey = currentModel.algorithm
    const templateFile = Templates[modelKey as keyof typeof Templates]
    fetch('/templates/' + templateFile).then((res) =>
      res.text().then((text) => setTemplate(text))
    )
  }

  /**
   * Render
   */
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

        <Steps className="Editor-Steps" direction="vertical">
          {steps.map((step, index) => (
            <Steps.Step
              key={step.title}
              title={step.title}
              description={step.description}
              status={stepsStatus[index] ?? step.status}
            />
          ))}
        </Steps>
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
            <Space>
              <Dropdown
                overlay={
                  <Menu
                    items={Models.map((m, index) => ({
                      key: index,
                      label: m.name,
                      onClick: loadModel
                    }))}
                  />
                }
              >
                <Button type="primary">Load existing model</Button>
              </Dropdown>
            </Space>
            <Space>
              <EditButton bordered onEdit={() => {}} />
              <Button icon={<SaveOutlined />} />
              <Button icon={<ShareAltOutlined />} />
              <DeleteButton bordered onDelete={async () => {}} />
            </Space>
          </div>
        </Layout.Header>

        <DynamicCodeEditor model={model} template={template} />
      </Layout.Content>
    </Layout>
  )
}

export default Editor
