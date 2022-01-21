/** @module Components.Editor */

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import {
  Alert,
  Button,
  Layout,
  List,
  Steps,
  Space,
  Divider,
  Typography
} from 'antd'

import { GoBack } from '@/components/assets/button'

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

const DynamicCodeEditor = dynamic(() => import('./code'), { ssr: false })

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

  // Data
  const router = useRouter()

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
   * Handle dashboard
   */
  const handleDashboard = () => {
    router.push({
      pathname: '/dashboard'
    })
  }

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
        <GoBack onClick={handleDashboard}>Return to dashboard</GoBack>

        <Divider
          style={{ width: '250px', minWidth: 'unset', margin: '10px 25px' }}
        />

        <Steps
          className="editor-steps"
          direction="vertical"
          current={step}
          onChange={onStepsChange}
        >
          <Steps.Step
            status={informationStatus}
            title="Information"
            description="Title, description, category, ..."
          />
          <Steps.Step title="Geometry" />
          <Steps.Step title="Material" />
          <Steps.Step title="Material" />
          <Steps.Step title="Physic" />
          <Steps.Step title="Initialization" />
          <Steps.Step title="Boundary conditions" />
          <Steps.Step title="Results" />
        </Steps>

        <Button disabled={true} type="primary">
          Submit
        </Button>
      </Layout.Sider>

      <Layout.Content style={{ overflow: 'auto', padding: '10px' }}>
        <DynamicCodeEditor />
        {/* {step === 0 && (
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
        {step === 2 && <Script configuration={configuration} />} */}
      </Layout.Content>

      <Layout.Sider theme="light">
        <Alert
          type="success"
          message={
            <>
              To correctly use the editor, you must know:
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
            </>
          }
        />
        <List header={<Typography.Text strong>Variables list</Typography.Text>}>
          <List.Item>Variable 1</List.Item>
          <List.Item>Variable 2</List.Item>
        </List>
      </Layout.Sider>
    </Layout>
  )
}

export default Editor
