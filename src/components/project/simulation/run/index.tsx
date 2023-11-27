/** @module Components.Project.Simulation.Run */

import {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
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
  IFrontGeometriesItem
} from '@/api/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import useCustomEffect from '@/components/utils/useCustomEffect'

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
export interface IProps {
  geometries: Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>[]
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  results: IFrontResult[]
  setResults: (results: IFrontResult[]) => void
  setPostprocessing: (result?: IFrontResult) => void
  setVisible: (visible: boolean) => void
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
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
  cloudServer: HPCClientPlugin,
  swr: {
    mutateSimulation: (simulation: IFrontMutateSimulation) => Promise<void>
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
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
    await swr.mutateOneSimulation(newSimulation)
    await swr.mutateSimulation(newSimulation)
  } catch (err: any) {
    dispatch(addError({ title: errors.update, err }))
  }
}

/**
 * On run
 * @param simulation Simulation
 * @param keepMesh Keep mesh
 */
export const _onRun = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  dispatch: Dispatch<INotificationAction>,
  keepMesh?: boolean
): Promise<void> => {
  try {
    await SimulationAPI.run({ id: simulation.id }, keepMesh)
  } catch (err: any) {
    dispatch(addError({ title: errors.run, err }))
    throw err
  }
}

/**
 * On stop
 */
export const _onStop = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  dispatch: Dispatch<INotificationAction>
): Promise<void> => {
  try {
    await SimulationAPI.stop({ id: simulation.id })
  } catch (err: any) {
    dispatch(addError({ title: errors.stop, err }))
    throw err
  }
}

/**
 * Run
 * @param props Props
 */
const Run = ({
  geometries,
  simulation,
  results,
  setResults,
  setPostprocessing,
  setVisible,
  swr
}: IProps): React.JSX.Element => {
  // State
  const [disabled, setDisabled] = useState<boolean>(false)
  const [running, setRunning] = useState<boolean>(false)

  const [keepMeshAvailable, setKeepMeshAvailable] = useState<boolean>(false)
  const [keepMesh, setKeepMesh] = useState<boolean>(false)

  const [steps, setSteps] = useState<IFrontSimulationTask[]>([])
  const [percent, setPercent] = useState<number>(0)

  // Context
  const { dispatch } = useContext(NotificationContext)

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

  // Keep mesh
  useEffect(() => {
    if (!configuration) return

    const geometry = configuration.geometry
    let alreadyMeshed = true
    geometry.children.forEach((child) => {
      if (!child.mesh) alreadyMeshed = false
    })
    if (alreadyMeshed) {
      setKeepMeshAvailable(true)
    } else {
      setKeepMeshAvailable(false)
      setKeepMesh(false)
    }
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
    const newSteps: (IFrontSimulationTask & { percent?: number })[] = []
    currentSimulation?.tasks?.forEach((task, index) => {
      if (!task) return

      if (index === currentSimulation.tasks.length - 1) {
        const lines = task.log?.split('\n') ?? []
        const percents = lines
          .filter((line) => line.startsWith('PERCENT:'))
          .filter((l) => l)
        const percent = percents?.pop()
        const percentNumber = percent
          ? parseFloat(percent.replace('PERCENT: ', '').replace('%', ''))
          : 0
        if (percentNumber) setPercent(percentNumber)
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

    setSteps(newSteps)
  }, [currentSimulation?.tasks])

  /**
   * On ok
   * @param cloudServer Cloud server
   */
  const onOk = useCallback(
    async (cloudServer: HPCClientPlugin): Promise<void> =>
      _onCloudServer(
        simulation,
        cloudServer,
        {
          ...swr,
          mutateSimulation
        },
        dispatch
      ),
    [simulation, swr, mutateSimulation, dispatch]
  )

  /**
   * On keep mesh
   * @param event Event
   */
  const onKeepMesh = useCallback((event: CheckboxChangeEvent): void => {
    setKeepMesh(event.target.checked)
  }, [])

  /**
   * On run click
   */
  const onRunClick = useCallback((): void => {
    ;(async () => {
      setRunning(true)
      try {
        await _onRun(simulation, dispatch, keepMesh)
      } catch (err) {
        setRunning(false)
      }
    })()
  }, [simulation, keepMesh, dispatch])

  /**
   * On stop click
   */
  const onStopClick = useCallback((): void => {
    ;(async () => {
      try {
        await _onStop(simulation, dispatch)
        setRunning(false)
      } catch (err) {}
    })()
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
                scheme: currentSimulation.scheme,
                tasks: currentSimulation.tasks
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
