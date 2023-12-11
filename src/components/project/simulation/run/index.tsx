/** @module Components.Project.Simulation.Run */

import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Card, Checkbox, Layout, Space, Spin, Steps } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
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
import { HPCClientPlugin } from '@/plugins/index.d'
import {
  IFrontSimulationsItem,
  IFrontResult,
  IFrontMutateSimulation,
  IFrontMutateSimulationsItem,
  IFrontSimulationTask,
  IFrontGeometriesItem,
  IFrontSimulation
} from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

import Sensors from './sensors'
import CloudServer from './cloudServer'
import Log from './log'
import Results from './results'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export type Geometry = Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface IProps {
  geometries: Geometry[]
  simulation: Simulation
  results: IFrontResult[]
  setResults: (results: IFrontResult[]) => void
  setPostprocessing: (result?: IFrontResult) => void
  setVisible: (visible: boolean) => void
  swr: Swr
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
  simulation: Simulation,
  cloudServer: HPCClientPlugin,
  swr: Swr & {
    mutateSimulation: (simulation: IFrontMutateSimulation) => Promise<void>
  }
): Promise<void> => {
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
  await swr.mutateOneSimulation(newSimulation)
  await swr.mutateSimulation(newSimulation)
}

/**
 * On run
 * @param simulation Simulation
 * @param keepMesh Keep mesh
 */
export const _onRun = async (
  simulation: Simulation,
  keepMesh?: boolean
): Promise<void> => await SimulationAPI.run({ id: simulation.id }, keepMesh)

/**
 * On stop
 */
export const _onStop = async (simulation: Simulation): Promise<void> =>
  await SimulationAPI.stop({ id: simulation.id })

/**
 * Run
 * @param props Props
 */
const Run: React.FunctionComponent<IProps> = ({
  geometries,
  simulation,
  results,
  setResults,
  setPostprocessing,
  setVisible,
  swr
}) => {
  // State
  const [running, setRunning] = useState<boolean>(false)
  const [keepMesh, setKeepMesh] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const [currentSimulation, { mutateSimulation }] = SimulationAPI.useSimulation(
    simulation.id,
    2000
  )

  // Configuration
  const configuration = useMemo(
    () => simulation.scheme.configuration,
    [simulation]
  )

  // Current configuration
  const currentConfiguration = useMemo(() => {
    if (currentSimulation.id === '0') return
    return (currentSimulation as IFrontSimulation).scheme.configuration
  }, [currentSimulation])

  // Disabled
  const disabled = useMemo(() => {
    if (!configuration) return true

    let disabled = false
    Object.keys(configuration).forEach((key) => {
      if (key !== 'dimension' && key !== 'run') {
        const item = configuration[key as keyof IModel['configuration']] as
          | IModelRun
          | IModelGeometry
          | IModelMaterials
          | IModelParameters
          | IModelInitialization
          | IModelBoundaryConditions
        if (!item.done) disabled = true
      }
    })
    if (!configuration.run.cloudServer) disabled = false

    return disabled
  }, [configuration])

  // Keep mesh
  const keepMeshAvailable = useMemo(() => {
    if (!configuration) return false

    const geometry = configuration.geometry
    let alreadyMeshed = true
    geometry.children.forEach((child) => {
      if (!child.mesh) alreadyMeshed = false
    })
    if (alreadyMeshed) return true
    else return false
  }, [configuration])

  // Steps
  const { steps, percent } = useMemo(() => {
    if (currentSimulation.id === '0') return { steps: [], percent: undefined }

    const validSimulation = currentSimulation as IFrontSimulation

    let percent
    const newSteps: IFrontSimulationTask[] = []
    validSimulation?.tasks?.forEach((task, index) => {
      if (!task) return

      if (index === validSimulation.tasks.length - 1) {
        const lines = task.log?.split('\n') ?? []
        const percents = lines
          .filter((line) => line.startsWith('PERCENT:'))
          .filter((l) => l)
        const lastPercent = percents?.pop()
        const percentNumber = lastPercent
          ? parseFloat(lastPercent.replace('PERCENT: ', '').replace('%', ''))
          : 0
        if (percentNumber) percent = percentNumber
      }

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

    return { steps: newSteps, percent }
  }, [currentSimulation])

  // Running ?
  useEffect(() => {
    if (currentSimulation.id === '0') {
      setRunning(false)
      return
    }

    const validSimulation = currentSimulation as IFrontSimulation
    if (validSimulation?.tasks?.find((t) => t?.status === 'error')) {
      setRunning(false)
    } else if (
      validSimulation?.tasks?.find((t) => t && t.status !== 'finish')
    ) {
      setRunning(true)
    } else setRunning(false)
  }, [currentSimulation])

  /**
   * On ok
   * @param cloudServer Cloud server
   */
  const onOk = useCallback(
    async (cloudServer: HPCClientPlugin): Promise<void> => {
      try {
        await _onCloudServer(simulation, cloudServer, {
          ...swr,
          mutateSimulation
        })
      } catch (err: any) {
        dispatch(addError({ title: errors.update, err }))
      }
    },
    [simulation, swr, mutateSimulation, dispatch]
  )

  /**
   * On keep mesh
   * @param event Event
   */
  const onKeepMesh = useCallback(
    (event: CheckboxChangeEvent): void => setKeepMesh(event.target.checked),
    []
  )

  /**
   * On run click
   */
  const onRunClick = useCallback((): void => {
    asyncFunctionExec(async () => {
      setRunning(true)
      try {
        await _onRun(simulation, keepMesh)
      } catch (err: any) {
        dispatch(addError({ title: errors.run, err }))
        setRunning(false)
      }
    })
  }, [simulation, keepMesh, dispatch])

  /**
   * On stop click
   */
  const onStopClick = useCallback((): void => {
    asyncFunctionExec(async () => {
      try {
        await _onStop(simulation)
        setRunning(false)
      } catch (err: any) {
        dispatch(addError({ title: errors.stop, err }))
      }
    })
  }, [simulation, dispatch])

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
        <Space direction="vertical" className={globalStyle.fullWidth}>
          <Sensors
            geometries={geometries}
            simulation={simulation}
            setVisible={setVisible}
            setResults={setResults}
            setPostprocessing={setPostprocessing}
            swr={{
              mutateOneSimulation: swr.mutateOneSimulation
            }}
          />
          <CloudServer
            disabled={running}
            parallel={simulation.scheme.parallel}
            cloudServer={currentConfiguration?.run?.cloudServer}
            onOk={onOk}
          />
          <Card size="small" title="Run">
            <Space
              direction="vertical"
              className={globalStyle.fullWidth}
              size={20}
            >
              {keepMeshAvailable ? (
                <Checkbox checked={keepMesh} onChange={onKeepMesh}>
                  Keep mesh(es)?
                </Checkbox>
              ) : null}
              <div
                className={globalStyle.fullWidth}
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
                current={steps.length - 1}
                percent={percent}
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
                scheme: (currentSimulation as IFrontSimulation).scheme,
                tasks: (currentSimulation as IFrontSimulation).tasks
              }
            }
            results={results}
            setResults={setResults}
          />
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Run
