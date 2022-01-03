/** @module Components.Editor */

import { useState, useEffect } from 'react'
import { Alert, Button, Divider, Layout, List, Steps, Space } from 'antd'

import Information from './information'
import Configuration from './configuration'
import Script from './script'

export type TValue = boolean | number | string

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
      default: TValue
      unit?: string
    }[]
  }
  parameters?: {
    [key: string]: {
      key?: string
      label: string
      children: {
        label: string
        default: TValue
        unit?: string
        htmlEntity?: string
      }[]
    }
  }
  initialization?: {
    [key: string]: {
      type?: string
      key?: string
      label: string
      children?: {
        label: string
        default: TValue
        unit?: string
        htmlEntity?: string
      }[]
      compatibility?: {
        algorithm: string
        filter: {
          name: string
          prefixPattern?: string
          suffixPattern?: string
          pattern?: string
          multiplicator?: string[]
        }
      }[]
    }
  }
  boundaryConditions?: {
    [key: string]: {
      key?: string
      label: string
      refineFactor?: string
      children: {
        label: string
        default: TValue
        unit?: string
        htmlEntity?: string
      }[]
    }
  }
  results?: {
    fields?: {
      name: string
    }[]
    filter?: {
      name: string
      prefixPattern?: string
      suffixPattern?: string
      pattern?: string
      multiplicator?: string[]
    }
  }
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
        <Divider />
        <Alert
          type="success"
          message={
            <>
              To correctly use the editor, you must know:
              <List>
                <List.Item>
                  <Space direction="vertical">
                    <Button
                      type="primary"
                      href="https://freefem.org/"
                      target="_blank"
                    >
                      FreeFEM
                    </Button>
                    to write the finite element problem
                  </Space>
                </List.Item>
                <List.Item>
                  <Space direction="vertical">
                    <Button
                      type="primary"
                      href="https://ejs.co/"
                      target="_blank"
                    >
                      EJS
                    </Button>
                    to use the template system of Tanatloc
                  </Space>
                </List.Item>
                <List.Item>
                  <Space direction="vertical">
                    And read the
                    <Button type="primary" href="#">
                      Editor documentation
                    </Button>
                    TODO
                  </Space>
                </List.Item>
              </List>
            </>
          }
        />
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
        {step === 2 && <Script configuration={configuration} />}
      </Layout.Content>
    </Layout>
  )
}

export default Editor
