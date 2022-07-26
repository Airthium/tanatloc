/** @module Components.Editor */

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import {
  Layout,
  Steps,
  Menu,
  Space,
  Button,
  Tooltip,
  Tabs,
  Typography,
  Divider,
  Collapse
} from 'antd'
import {
  FileAddOutlined,
  FolderOpenOutlined,
  SaveOutlined,
  ShareAltOutlined
} from '@ant-design/icons'

import { IModel } from '@/models/index.d'

import { DeleteButton, GoBack } from '@/components/assets/button'

import UserAPI from '@/api/user'

import Models from '@/models'
import Templates from '@/templates'
import Dialog from '../assets/dialog'
import { ErrorNotification } from '../assets/notification'

const DynamicCodeEditor = dynamic(() => import('./code'), { ssr: false })

/**
 * Errors
 */
const errors = {
  load: 'Unable to load model'
}

/**
 * Editor
 */
const Editor = () => {
  // Sate
  const [stepsStatus, setStepsStatus] = useState<{
    [key: string]: 'wait' | 'process' | 'finish' | 'error'
  }>({})
  const [name, setName] = useState<string>()
  const [model, setModel] = useState<string>()
  const [template, setTemplate] = useState<string>()

  const [modelsVisible, setModelsVisible] = useState<boolean>(false)
  const [modelsLoading, setModelsLoading] = useState<boolean>(false)

  // Data
  const router = useRouter()
  const [user, { loadingUser }] = UserAPI.useUser()

  // Not logged -> go to login page
  useEffect(() => {
    if (!loadingUser && !user) router.replace('/')
  }, [user, loadingUser, router])

  // Check template
  useEffect(() => {
    if (!template) {
      setStepsStatus((prev) => ({
        ...prev,
        template: 'wait',
        test: 'wait'
      }))
      return
    }

    try {
      // TODO
      setStepsStatus((prev) => ({
        ...prev,
        template: 'finish',
        test: prev.model === 'finish' ? 'process' : 'wait'
      }))
    } catch (err) {
      setStepsStatus((prev) => ({ ...prev, template: 'error', test: 'wait' }))
    }
  }, [template])

  // Check model
  useEffect(() => {
    if (!model) {
      setStepsStatus((prev) => ({
        ...prev,
        model: 'wait',
        test: 'wait'
      }))
      return
    }

    try {
      const modelJSON = JSON.parse(model) as IModel

      if (modelJSON.name) setName(modelJSON.name)

      if (!modelJSON.category) throw new Error('missing category')
      if (!modelJSON.name) throw new Error('missing name')
      if (!modelJSON.algorithm) throw new Error('missing algorithm')
      if (!modelJSON.code) throw new Error('missing code')
      if (!modelJSON.version) throw new Error('missing version')
      if (!modelJSON.configuration) throw new Error('missing configuration')
      if (!modelJSON.configuration.geometry)
        throw new Error('missing configuration.geometry')
      // TODO ...

      setStepsStatus((prev) => ({
        ...prev,
        model: 'finish',
        test: prev.model === 'finish' ? 'process' : 'wait'
      }))
    } catch (err) {
      setStepsStatus((prev) => ({
        ...prev,
        model: 'error',
        test: 'wait'
      }))
    }
  }, [model])

  /**
   * Handle dashboard
   */
  const handleDashboard = useCallback(() => {
    router.push({
      pathname: '/dashboard'
    })
  }, [router])

  const onNew = () => {
    setName(undefined)
    setTemplate(
      `try{
<%# Headers -%>
<%- helpers.indent(include('/blobs/headers.edp.ejs'), 1) -%>

<%# Dimension -%>
<%- helpers.indent(include('/blobs/dimensioning.edp.ejs', {
	dimension
}), 1) -%>



} catch(...) {
  appendError("An internal error occurs");
  exit(-1);
}`
    )
    setModel('')
  }

  /**
   * Load model
   * @param key Key
   */
  const loadModel = async (key: number): Promise<void> => {
    setModelsLoading(true)

    try {
      // Model
      const currentModel = Models[key]
      setModel(JSON.stringify(currentModel, null, '  '))

      // Template
      const modelKey = currentModel.algorithm
      const templateFile = Templates[modelKey as keyof typeof Templates]
      const res = await fetch('/templates/' + templateFile)
      const text = await res.text()
      setTemplate(text)

      setModelsVisible(false)
    } catch (err) {
      ErrorNotification(errors.load, err)
    } finally {
      setModelsLoading(false)
    }
  }

  const addHeader = () => {
    setTemplate(
      (template || '') +
        "<%# Headers -%>\n<%- helpers.indent(include('/blobs/headers.edp.ejs'), 1) -%>\n"
    )
  }

  const addDimension = () => {}

  /**
   * Render
   */
  return (
    <Layout className="Editor">
      <Dialog
        title="Open model"
        visible={modelsVisible}
        loading={modelsLoading}
        onCancel={() => setModelsVisible(false)}
      >
        <Layout>
          <Layout.Content>
            <Tabs>
              <Tabs.TabPane tab="Tanatloc models">
                <Space direction="vertical" className="full-width">
                  {Models.map((m, index) => (
                    <Button
                      key={index}
                      onClick={() => loadModel(index)}
                      className="full-width"
                    >
                      {m.name}
                    </Button>
                  ))}
                </Space>
              </Tabs.TabPane>
            </Tabs>
          </Layout.Content>
        </Layout>
      </Dialog>
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
          onChange={console.log}
        >
          <Steps.Step
            title="Check template format"
            description="EJS + FreeFEM"
            status={stepsStatus['template'] ?? 'wait'}
            disabled={true}
          />
          <Steps.Step
            title="Check description format"
            description="JSON"
            status={stepsStatus['model'] ?? 'wait'}
            disabled={true}
          />
          <Steps.Step
            title="Test template + description"
            description="Run template on Tanatloc server"
            status={stepsStatus['test'] ?? 'wait'}
            disabled={
              !(
                stepsStatus['template'] === 'finish' &&
                stepsStatus['model'] === 'finish'
              )
            }
          />
        </Steps>
        <Divider />
        <Collapse style={{ overflow: 'auto', maxHeight: 'calc(100% - 443px)' }}>
          <Collapse.Panel key="head" header="Head">
            <Space direction="vertical" className="full-width">
              <Button className="full-width" onClick={addHeader}>
                Header
              </Button>
              <Button className="full-width" onClick={addDimension}>
                Dimension
              </Button>
            </Space>
          </Collapse.Panel>

          <Collapse.Panel key="components" header="Components">
            <Space direction="vertical" className="full-width">
              <Button className="full-width">Mesh</Button>
              <Button className="full-width">Materials</Button>
              <Button className="full-width">Finite element space</Button>
              <Button className="full-width">Finite element function</Button>
              <Button className="full-width">Macros</Button>
              <Button className="full-width">Solver</Button>
            </Space>
          </Collapse.Panel>

          <Collapse.Panel key="results" header="Results">
            <Space direction="vertical" className="full-width">
              <Button className="full-width">Save</Button>
              <Button className="full-width">Data</Button>
              <Button className="full-width">Coupling</Button>
              <Button className="full-width">Sensors</Button>
            </Space>
          </Collapse.Panel>
        </Collapse>
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
              <Tooltip title="New model">
                <Button icon={<FileAddOutlined />} onClick={onNew} />
              </Tooltip>
              <Tooltip title="Open model">
                <Button
                  icon={<FolderOpenOutlined />}
                  onClick={() => setModelsVisible(true)}
                />
              </Tooltip>
              <Button icon={<SaveOutlined />} />
              <Button icon={<ShareAltOutlined />} />
              <DeleteButton
                bordered
                onDelete={async () => console.log('delete')}
              />
            </Space>
          </div>
        </Layout.Header>

        <DynamicCodeEditor
          model={model}
          template={template}
          setModel={setModel}
          setTemplate={setTemplate}
        />
      </Layout.Content>
    </Layout>
  )
}

export default Editor
