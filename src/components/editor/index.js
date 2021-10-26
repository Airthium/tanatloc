/** @namespace Components.Editor */

import { useState, useEffect } from 'react'
import { Button, Layout, Steps } from 'antd'

import Information from './information'
import Configuration from './configuration'
import Script from './script'

/**
 * Editor
 * @memberof Components.Editor
 */
const Editor = () => {
  // State
  const [step, setStep] = useState(0)
  const [informationStatus, setInformationStatus] = useState('wait')
  const [configuration, setConfiguration] = useState({})

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
   * @param {number} current Current step
   */
  const onStepsChange = (current) => {
    setStep(current)
  }

  const onInformation = (values) => {
    setConfiguration({
      ...configuration,
      ...values
    })
    setStep(step + 1)
  }

  const onConfiguration = (values) => {
    setConfiguration({
      ...configuration,
      ...values
    })
    setStep(step + 1)
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
            status={step !== 1 && 'wait'}
            title="Configuration"
            description="Geometry, parameters, ..."
          />
          <Steps.Step
            status={step !== 2 && 'wait'}
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
