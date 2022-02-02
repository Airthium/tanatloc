/** @module Components.Editor */

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { ReactElement, useState, useEffect } from 'react'
import { Alert, Button, Layout, Steps, Space, Divider } from 'antd'

import { GoBack } from '@/components/assets/button'

import Panel from './panel'

import Information from './information'
import Geometry from './geometry'
import NumericalParameters from './numericalParameters'
import Materials from './materials'
import PhysicalParameters from './physicalParameters'
import Initializations from './initializations'
import BoundaryConditions from './boundaryConditions'

import Variables from './variables'

const DynamicCodeEditor = dynamic(() => import('./code'), { ssr: false })

export type TValue = boolean | number | string

export interface IConfiguration {
  information?: {
    name: string
    category: string
    description: string
  }
  geometry?: {
    meshable: boolean
    name: string
  }
  numericalParameters?: {
    finiteElementSpace: {
      name: string
      options: {
        label: string
        '2d': string
        '3d': string
      }[]
      default: string
    }
    solver: {
      options: string[]
      default: string
    }
  }
  materials?: {
    children: {
      name: string
      symbol: string
      default: TValue
      unit?: string
    }[]
  }
  parameters?: {
    [key: string]: {
      name: string
      children: {
        name: string
        default: TValue
        unit?: string
      }[]
    }
  }
  initializations?: {
    [key: string]: {
      type: string
      name: string
      children?: {
        name: string
        default: TValue
        unit?: string
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
      name: string
      refineFactor?: string
      children?: {
        name: string
        default: TValue
        unit?: string
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
  component: ({
    configuration: IConfiguration,
    onNext: Function
  }) => ReactElement
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
    title: 'Geometry',
    description: 'Name, meshable, ...',
    component: Geometry,
    status: 'wait'
  },
  {
    title: 'Numerical parameters',
    description: 'finite element space, ...',
    component: NumericalParameters,
    status: 'wait'
  },
  {
    title: 'Materials',
    description: 'Name, symbol, default, ...',
    component: Materials,
    status: 'wait'
  },
  {
    title: 'Physical parameters',
    description: 'Name, default, unit, ...',
    component: PhysicalParameters,
    status: 'wait'
  },
  {
    title: 'Initializations',
    description: 'Direct, coupling, ...',
    component: Initializations,
    status: 'wait'
  },
  {
    title: 'Boundary conditions',
    description: 'Dirichlet, Neumann, ...',
    component: BoundaryConditions,
    status: 'wait'
  },
  {
    title: 'Results',
    description: 'todo',
    component: undefined,
    status: 'wait'
  }
]

// Test configuration
const initialConfiguration: IConfiguration = {
  information: {
    name: 'name',
    category: 'Academic',
    description: 'description'
  },
  geometry: {
    meshable: true,
    name: 'Mesh'
  },
  numericalParameters: {
    finiteElementSpace: {
      name: 'Uh',
      options: [
        {
          label: 'P2/P1',
          '2d': '[P2, P2, P1]',
          '3d': '[P2, P2, P2, P1]'
        },
        {
          label: 'P1b/P1',
          '2d': '[P1b, P1b, P1]',
          '3d': '[P1b, P1b, P1b, P1]'
        }
      ],
      default: 'P2/P1'
    },
    solver: {
      options: ['MUMPS', 'SuperLU', 'SuperLU_DIST'],
      default: 'MUMPS'
    }
  },
  materials: {
    children: [
      {
        name: 'rho',
        symbol: 'Rho',
        default: '1e3',
        unit: 'kg.m^{-3}'
      }
    ]
  },
  parameters: {
    test: {
      name: 'Time',
      children: [
        {
          name: 'T',
          default: 1,
          unit: 's'
        },
        {
          name: 'dt',
          default: 0.01,
          unit: 's'
        }
      ]
    }
  },
  initializations: {},
  boundaryConditions: {
    dirichlet: {
      name: 'Dirichlet',
      refineFactor: '1',
      children: [
        {
          name: 'UDx',
          default: 0,
          unit: ''
        }
      ]
    },
    neumann: {
      name: 'Neumann',
      children: [
        {
          name: 'UN',
          default: 0,
          unit: ''
        }
      ]
    },
    empty: {
      name: 'Empty'
    }
  }
}

/**
 * Editor
 * @memberof Components.Editor
 */
const Editor = (): JSX.Element => {
  // State
  const [current, setCurrent]: [number, Function] = useState(-1)
  const [panel, setPanel]: [IStep, Function] = useState()
  const [configuration, setConfiguration]: [IConfiguration, Function] =
    useState(initialConfiguration)

  // Data
  const router = useRouter()

  // Step
  useEffect(() => {
    if (current >= 0) {
      steps[current].status = 'process'
      setPanel(steps[current])
    }
  }, [current])

  // Step status
  useEffect(() => {
    // Cleanup
    steps.forEach((step) => (step.status = 'wait'))

    // Information
    if (
      configuration?.information?.name &&
      configuration?.information?.category &&
      configuration?.information?.description
    )
      steps[0].status = 'finish'
    else steps[0].status = 'wait'

    // Geometry
    if (
      configuration?.geometry?.meshable !== undefined &&
      configuration?.geometry?.name
    )
      steps[1].status = 'finish'
    else steps[1].status = 'wait'

    // Numerical parameters
    if (
      configuration?.numericalParameters?.finiteElementSpace?.options?.length &&
      configuration?.numericalParameters?.finiteElementSpace?.default &&
      configuration?.numericalParameters?.solver?.options &&
      configuration?.numericalParameters?.solver?.default
    ) {
      steps[2].status = 'finish'
    } else steps[2].status = 'wait'

    // Materials
    if (configuration?.materials) steps[3].status = 'finish'
    else steps[3].status = 'wait'

    // Parameters
    if (configuration?.parameters) steps[4].status = 'finish'
    else steps[4].status = 'wait'

    // Initializations
    if (configuration?.initializations) steps[5].status = 'finish'
    else steps[5].status = 'wait'

    // Boundary conditions
    if (Object.keys(configuration?.boundaryConditions || {}).length)
      steps[6].status = 'finish'
    else steps[6].status = 'wait'
  }, [panel, configuration])

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

  console.log(configuration)

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
          onClose={() => {
            setPanel()
            setCurrent(-1)
          }}
        >
          {panel?.component && (
            <panel.component
              configuration={configuration}
              onNext={onConfiguration}
            />
          )}
        </Panel>
        <DynamicCodeEditor configuration={configuration} />
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
        <Variables configuration={configuration} />
      </Layout.Sider>
    </Layout>
  )
}

export default Editor
