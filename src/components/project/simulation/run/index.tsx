/** @module Components.Project.Simulation.Run */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Button, Card, Layout, Space, Spin, Steps } from 'antd'
import { RocketOutlined, StopOutlined } from '@ant-design/icons'

import {
  IClientPlugin,
  ISimulation,
  ISimulationTask,
  ISimulationTaskFile
} from '@/database/index.d'
import { IModel } from '@/models/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import CloudServer from './cloudServer'
import Log from './log'
import Results from './results'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  simulation: ISimulation
  result: ISimulationTaskFile
  setResult: Function
  swr: {
    mutateOneSimulation: Function
  }
}

/**
 * Errors (run)
 */
const errors = {
  runError: 'Unable to run the simulation',
  stopError: 'Unable to stop the simulation',
  updateError: 'Unable to update the simulation'
}

/**
 * On cloud server
 * @param {Object} cloudServer Cloud server
 */
const onCloudServer = async (
  cloudServer: IClientPlugin,
  currentSimulation: ISimulation,
  configuration: IModel["configuration"],
  simulation: ISimulation,
  swr: IProps['swr'],
  mutateSimulation: Function
): Promise<void> => {
  try {
    // New simulation
    const newSimulation = { ...currentSimulation }

    // Update local
    configuration.run.cloudServer = cloudServer
    newSimulation.scheme.configuration = configuration

    // API
    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'run'],
        value: configuration.run
      }
    ])

    // Local
    swr.mutateOneSimulation(newSimulation)
    mutateSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.updateError, err)
  }
}

/**
 * On run
 */
const onRun = async (simulation: ISimulation): Promise<void> => {
  try {
    await SimulationAPI.run({ id: simulation.id })
  } catch (err) {
    ErrorNotification(errors.runError, err)
    throw err
  }
}

/**
 * On stop
 */
const onStop = async (simulation: ISimulation): Promise<void> => {
  try {
    await SimulationAPI.stop({ id: simulation.id })
  } catch (err) {
    ErrorNotification(errors.stopError, err)
  }
}

/**
 * Run
 * @param props Props
 */
const Run = ({ simulation, result, setResult, swr }: IProps): JSX.Element => {
  // State
  const [disabled, setDisabled]: [boolean, Function] = useState(false)
  const [running, setRunning]: [boolean, Function] = useState(false)

  const [steps, setSteps]: [ISimulationTask[], Function] = useState([])

  // Data
  const [currentSimulation, { mutateSimulation }] = SimulationAPI.useSimulation(
    simulation?.id,
    2000
  )

  const configuration = simulation?.scheme?.configuration
  const currentConfiguration = currentSimulation?.scheme?.configuration

  // Check tasks
  useEffect(() => {
    if (!configuration) {
      setDisabled(true)
      return
    }

    let done = true
    Object.keys(configuration).forEach((key) => {
      if (key !== 'run' && !configuration[key].done) done = false
    })
    if (!configuration.run.cloudServer) done = false
    setDisabled(!done)
  }, [configuration])

  // Running
  useEffect(() => {
    if (currentSimulation?.tasks?.find((t) => t?.status === 'error')) {
      setRunning(false)
    } else if (
      currentSimulation?.tasks?.find((t) => t && t.status !== 'finish')
    ) {
      setRunning(true)
    } else setRunning(false)
  }, [currentSimulation?.tasks])

  // Steps
  useEffect(() => {
    const newSteps = []
    currentSimulation?.tasks?.forEach((task) => {
      if (!task) return
      // Steps
      newSteps[task.index] = {
        label: task.label,
        status: task.status,
        log: task.log,
        pluginLog: task.pluginLog,
        warning: task.warning,
        error: task.error,
        systemLog: task.systemLog
      }
    })

    setSteps(newSteps)
  }, [currentSimulation?.tasks])

  /**
   * Render
   */
  if (!simulation || !currentSimulation || currentSimulation?.id === '0')
    return (
      <Layout>
        <Layout.Content>
          <Card size="small">
            <Spin />
          </Card>
        </Layout.Content>
      </Layout>
    )
  else
    return (
      <Layout>
        <Layout.Content>
          <Space direction="vertical" className="full-width">
            <CloudServer
              disabled={running}
              cloudServer={currentConfiguration?.run?.cloudServer}
              onOk={async (cloudServer) => {
                try {
                  await onCloudServer(
                    cloudServer,
                    currentSimulation,
                    configuration,
                    simulation,
                    swr,
                    mutateSimulation
                  )
                } catch (err) {}
              }}
            />
            <Card size="small" title="Run">
              <Space direction="vertical" className="full-width">
                <div
                  className="full-width"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Space>
                    <Button
                      disabled={disabled}
                      type="primary"
                      icon={<RocketOutlined />}
                      loading={running}
                      onClick={async () => {
                        setRunning(true)
                        try {
                          await onRun(simulation)
                        } catch (err) {
                          setRunning(false)
                        }
                      }}
                    >
                      Run
                    </Button>
                    <Button
                      disabled={!running}
                      danger
                      icon={<StopOutlined />}
                      shape="circle"
                      onClick={async () => {
                        try {
                          await onStop(simulation)
                          setRunning(false)
                        } catch (err) {}
                      }}
                    />
                  </Space>
                  <Log simulation={{ id: simulation.id }} steps={steps} />
                </div>
                <Steps direction="vertical">
                  {steps.map((step, index) => (
                    <Steps.Step
                      key={step.label}
                      title={step.label}
                      description={'(' + (index + 1) + '/' + steps.length + ')'}
                      status={step.status}
                    />
                  ))}
                </Steps>
              </Space>
            </Card>

            <Results
              simulation={simulation}
              currentSimulation={currentSimulation}
              result={result}
              setResult={setResult}
            />
          </Space>
        </Layout.Content>
      </Layout>
    )
}

Run.propTypes = {
  simulation: PropTypes.object.isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  result: PropTypes.object.isRequired,
  setResult: PropTypes.func.isRequired
}

export default Run
