/** @module Components.Editor */

import { useState, useEffect } from 'react'
import { Button, Layout, Steps } from 'antd'

import Information from './information'
import Configuration from './configuration'
import Script from './script'

export interface IConfiguration {
  name?: string
  category?: string
  description?: string
  geometry?: {
    meshable: boolean
    name: string
  }
  materials?: {
    children: {
      index: number
      label: string
      symbol: string
      default: string
      unit: string
    }[]
  }
  parameters?: {
    [key: string]: {
      key?: string
      label: string
      children: {
        label: string
        default: string
        unit: string
        htmlEntity?: string
      }[]
    }
  }
  initialization?: {}
  boundaryConditions?: {}
  results?: {}
}

/**
 * Editor
 * @memberof Components.Editor
 */
const Editor = (): JSX.Element => {
  // State
  const [step, setStep]: [number, Function] = useState(0)
  const [informationStatus, setInformationStatus]: [
    'finish' | 'wait',
    Function
  ] = useState('wait')
  const [configuration, setConfiguration]: [IConfiguration, Function] =
    useState({})

  useEffect(() => {
    if (step === 0) setInformationStatus('process')
    else if (
      configuration.name &&
      configuration.category &&
      configuration.description
    ) {
      setInformationStatus('finish')
    } else setInformationStatus('wait')
  }, [step, configuration])

  /**
   * On steps change
   * @param current Current step
   */
  const onStepsChange = (current: number): void => {
    setStep(current)
  }

  /**
   * On inforimation
   * @param values Values
   */
  const onInformation = (values: {
    name: string
    category: string
    description: string
  }): void => {
    setConfiguration({
      ...configuration,
      ...values
    })
    setStep(step + 1)
  }

  /**
   * On configuration
   * @param values Values
   */
  const onConfiguration = (values): void => {
    setConfiguration({
      ...configuration,
      ...values
    })
    setStep(step + 1)
  }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Sider theme="light" className="editor-sider" width={300}>
        <div className="logo">
          <img src="/images/logo.svg" alt="Tanatloc" />
        </div>
        <Steps
          className="editor-steps"
          type="navigation"
          direction="vertical"
          current={step}
          onChange={onStepsChange}
        >
          <Steps.Step
            status={informationStatus}
            title="Information"
            description="Title, description, category, ..."
          />
          <Steps.Step
            status={step !== 1 ? 'wait' : undefined}
            title="Configuration"
            description="Geometry, parameters, ..."
          />
          <Steps.Step
            status={step !== 2 ? 'wait' : undefined}
            title="Script"
            description="FreeFEM template"
          />
        </Steps>
        <Button disabled={true} type="primary">
          Submit
        </Button>
        {/* <Divider />
        <Typography.Text>Summary</Typography.Text>
        <Menu mode="inline">
          <Menu.SubMenu title="Geometry">
            {configuration.geometry && (
              <Menu.Item>
                Mesh variable:{' '}
                <Typography.Text code>
                  {configuration.geometry.name}
                </Typography.Text>
              </Menu.Item>
            )}
          </Menu.SubMenu>
        </Menu> */}
      </Layout.Sider>

      <Layout.Content style={{ overflow: 'auto', padding: '10px' }}>
        {step === 0 && (
          <Information
            configuration={{
              name: configuration.name,
              category: configuration.category,
              description: configuration.description
            }}
            onNext={onInformation}
          />
        )}
        {step === 1 && (
          <Configuration
            configuration={{
              geometry: configuration.geometry,
              materials: configuration.materials,
              parameters: configuration.parameters,
              initialization: configuration.initialization,
              boundaryConditions: configuration.boundaryConditions,
              results: configuration.results
            }}
            onNext={onConfiguration}
          />
        )}
        {step === 2 && <Script />}
      </Layout.Content>
    </Layout>
  )
}

export default Editor
