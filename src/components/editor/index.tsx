/** @module Components.Editor */

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { ReactComponentElement, useState, useEffect } from 'react'
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

import Panel from './panel'

import Information from './information'
import Configuration from './configuration'
import Script from './script'

const DynamicCodeEditor = dynamic(() => import('./code'), { ssr: false })

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

export interface IStep {
  title: string
  description: string
  component: any // TODO better type
  status: 'wait' | 'process' | 'finish' | 'error'
}

const steps: IStep[] = [
  {
    title: 'Informations',
    description: 'Title, description, category, ...',
    component: Information,
    status: 'wait'
  },
  {
    title: 'Geometries',
    description: 'todo',
    component: undefined,
    status: 'wait'
  },
  {
    title: 'Materials',
    description: 'todo',
    component: undefined,
    status: 'wait'
  },
  {
    title: 'Physical parameters',
    description: 'todo',
    component: undefined,
    status: 'wait'
  },
  {
    title: 'Initialization',
    description: 'todo',
    component: undefined,
    status: 'wait'
  },
  {
    title: 'Boundary conditions',
    description: 'todo',
    component: undefined,
    status: 'wait'
  },
  {
    title: 'Results',
    description: 'todo',
    component: undefined,
    status: 'wait'
  }
]

/**
 * Editor
 * @memberof Components.Editor
 */
const Editor = (): JSX.Element => {
  // State
  const [current, setCurrent]: [number, Function] = useState(-1)
  const [panel, setPanel]: [
    { title: string; description: string; component: ReactElement },
    Function
  ] = useState()
  const [configuration, setConfiguration]: [IConfiguration, Function] =
    useState({})

  // Data
  const router = useRouter()

  // Step
  useEffect(() => {
    if (current >= 0) setPanel(steps[current])
  }, [current])

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
  const onStepsChange = (number: number): void => {
    setCurrent(number)
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
    setCurrent(current + 1)
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

        <Button disabled={true} type="primary">
          Submit
        </Button>
      </Layout.Sider>

      <Layout.Content
        style={{ position: 'relative', overflow: 'auto', padding: '10px' }}
      >
        <Panel
          visible={!!panel}
          title={panel?.title}
          onClose={() => setPanel()}
        >
          {panel?.component && (
            <panel.component
              configuration={configuration}
              onNext={onConfiguration}
            />
          )}

          {/* <Information
            configuration={{
              name: configuration.name,
              category: configuration.category,
              description: configuration.description
            }}
            onNext={onConfiguration}
          /> */}
        </Panel>
        {/* )} */}
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
          )}*/}

        {/* <Configuration
          configuration={{
            geometry: configuration.geometry,
            materials: configuration.materials,
            parameters: configuration.parameters,
            initialization: configuration.initialization,
            boundaryConditions: configuration.boundaryConditions,
            results: configuration.results
          }}
          onNext={onConfiguration}
        /> */}
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
