/** @module Components.Editor */

import { useRouter } from 'next/router'
import { useState, Dispatch, SetStateAction } from 'react'
import { Layout, Steps, Divider } from 'antd'
import { GoBack } from '@/components/assets/button'
import dynamic from 'next/dynamic'

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
 * Dashboard
 */
const Editor = () => {
  const [current, setCurrent]: [number, Dispatch<SetStateAction<number>>] =
    useState(-1)
  // Data
  const router = useRouter()
  const safeCode = (str: string) => str?.replace(/[^A-Z0-9]+/gi, '')
  const [code, setCode] = useState('')
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

  return (
    <Layout className="Dashboard">
      <Layout.Sider theme="light" width="256" className="Dashboard-Sider">
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
      </Layout.Sider>

      <Layout.Content className="no-scroll">
        <DynamicCodeEditor />
      </Layout.Content>
    </Layout>
  )
}

export default Editor
