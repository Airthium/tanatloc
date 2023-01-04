/** @module Components.Project.Simulation.Run */

import { useCallback, useMemo, useState } from 'react'
import { Button, Card, Layout, Space, Spin, Steps } from 'antd'
import { RocketOutlined, StopOutlined } from '@ant-design/icons'

import {
  IModel,
  IModelRun,
  IModelGeometry,
  IModelMaterials,
  IModelParameters,
  IModelInitialization,
  IModelBoundaryConditions
} from '@/models/index.d'
import { IClientPlugin } from '@/plugins/index.d'
import {
  IFrontSimulationsItem,
  IFrontResult,
  IFrontMutateSimulation,
  IFrontMutateSimulationsItem,
  IFrontSimulationTask
} from '@/api/index.d'

import useCustomEffect from '@/components/utils/useCustomEffect'

import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

import Sensors from './sensors'
import CloudServer from './cloudServer'
import Log from './log'
import Results from './results'

import { globalStyle } from '@/styles'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  result?: Pick<IFrontResult, 'name' | 'fileName'>
  setResult: (result?: IFrontResult) => void
  setPostprocessing: (result?: IFrontResult) => void
  setVisible: (visible: boolean) => void
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

/**
 * Errors
 */
export const errors = {
  run: 'Unable to run simulation',
  stop: 'Unable to stop simulation',
  update: 'Unable to update simulation'
}

/**
 * On cloud server
 * @param cloudServer Cloud server
 */
export const _onCloudServer = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  cloudServer: IClientPlugin,
  swr: {
    mutateSimulation: (simulation: IFrontMutateSimulation) => void
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    // New simulation
    const newSimulation = Utils.deepCopy(simulation)

    // Update local
    const configuration = simulation.scheme.configuration
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
    swr.mutateSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
  }
}

/**
 * On run
 */
export const _onRun = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>
): Promise<void> => {
  try {
    await SimulationAPI.run({ id: simulation.id })
  } catch (err) {
    ErrorNotification(errors.run, err)
    throw err
  }
}

/**
 * On stop
 */
export const _onStop = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>
): Promise<void> => {
  try {
    await SimulationAPI.stop({ id: simulation.id })
  } catch (err) {
    ErrorNotification(errors.stop, err)
    throw err
  }
}

/**
 * Run
 * @param props Props
 */
const Run = ({
  simulation,
  result,
  setResult,
  setPostprocessing,
  setVisible,
  swr
}: IProps): JSX.Element => {
  // State
  const [disabled, setDisabled] = useState<boolean>(false)
  const [running, setRunning] = useState<boolean>(false)

  const [steps, setSteps] = useState<IFrontSimulationTask[]>([])

  // Data
  const [currentSimulation, { mutateSimulation }] = SimulationAPI.useSimulation(
    simulation.id,
    2000
  )

  const configuration = useMemo(
    () => simulation.scheme.configuration,
    [simulation]
  )
  const currentConfiguration = useMemo(
    () => currentSimulation?.scheme?.configuration,
    [currentSimulation]
  )

  // Check tasks
  useCustomEffect(() => {
    if (!configuration) {
      setDisabled(true)
      return
    }

    let done = true
    Object.keys(configuration).forEach((key) => {
      if (key !== 'dimension' && key !== 'run') {
        const item = configuration[key as keyof IModel['configuration']] as
          | IModelRun
          | IModelGeometry
          | IModelMaterials
          | IModelParameters
          | IModelInitialization
          | IModelBoundaryConditions
        if (!item.done) done = false
      }
    })
    if (!configuration.run.cloudServer) done = false
    setDisabled(!done)
  }, [configuration])

  // Running & steps
  useCustomEffect(() => {
    // Running
    if (currentSimulation?.tasks?.find((t) => t?.status === 'error')) {
      setRunning(false)
    } else if (
      currentSimulation?.tasks?.find((t) => t && t.status !== 'finish')
    ) {
      setRunning(true)
    } else setRunning(false)

    // Steps
    const newSteps: IFrontSimulationTask[] = []
    currentSimulation?.tasks?.forEach((task) => {
      if (!task) return
      // Steps
      newSteps[task.index] = {
        index: task.index,
        label: task.label,
        status: task.status,
        log: task.log,
        pluginLog: task.pluginLog,
        warning: task.warning,
        error: task.error,
        systemLog: task.systemLog,
        link: task.link
      }
    })

    setSteps(newSteps)
  }, [currentSimulation?.tasks])

  /**
   * On ok
   * @param cloudServer Cloud server
   */
  const onOk = useCallback(
    async (cloudServer: IClientPlugin): Promise<void> =>
      _onCloudServer(simulation, cloudServer, {
        ...swr,
        mutateSimulation
      }),
    [simulation, swr, mutateSimulation]
  )

  /**
   * On run click
   */
  const onRunClick = useCallback(async () => {
    setRunning(true)
    try {
      await _onRun(simulation)
    } catch (err) {
      setRunning(false)
    }
  }, [simulation])

  /**
   * On stop click
   */
  const onStopClick = useCallback(async () => {
    try {
      await _onStop(simulation)
      setRunning(false)
    } catch (err) {}
  }, [simulation])

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
  return (
    <Layout>
      <Layout.Content>
        <Space direction="vertical" css={globalStyle.fullWidth}>
          <Sensors
            simulation={simulation}
            setVisible={setVisible}
            setResult={setResult}
            setPostprocessing={setPostprocessing}
            swr={{
              mutateOneSimulation: swr.mutateOneSimulation
            }}
          />
          <CloudServer
            disabled={running}
            cloudServer={currentConfiguration?.run?.cloudServer}
            onOk={onOk}
          />
          <Card size="small" title="Run">
            <Space direction="vertical" css={globalStyle.fullWidth} size={20}>
              <div
                css={globalStyle.fullWidth}
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
                    onClick={onRunClick}
                  >
                    Run
                  </Button>
                  <Button
                    disabled={!running}
                    danger
                    icon={<StopOutlined />}
                    shape="circle"
                    onClick={onStopClick}
                  />
                </Space>
                <Log simulation={{ id: simulation.id }} steps={steps} />
              </div>
              <Steps
                direction="vertical"
                items={steps.map((step, index) => ({
                  key: index,
                  title: step.label,
                  description: '(' + (index + 1) + '/' + steps.length + ')',
                  status: step.status
                }))}
              />
            </Space>
          </Card>

          <Results
            simulation={
              currentSimulation && {
                id: currentSimulation.id,
                scheme: currentSimulation.scheme,
                tasks: currentSimulation.tasks
              }
            }
            result={
              result && {
                name: result.name,
                fileName: result.fileName
              }
            }
            setResult={setResult}
          />
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Run
