/** @module Components.Project.Simulation.Run.Log */

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'
import {
  Button,
  Collapse,
  Drawer,
  Modal,
  Tabs,
  Tooltip,
  Typography
} from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import parse from 'html-react-parser'

import { IFrontSimulationsItem, IFrontSimulationTask } from '@/api/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import SimulationAPI from '@/api/simulation'

import style from '../../index.module.css'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id'>
  steps: IFrontSimulationTask[]
}

export interface IStepProps {
  simulation: Pick<IFrontSimulationsItem, 'id'>
  step: IFrontSimulationTask
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

/**
 * Errors
 */
export const errors = {
  log: 'Unable to get system log'
}

/**
 * Get complete log
 * @param simulation Simulation
 * @param step Step
 */
export const _getCompleteLog = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  step: IFrontSimulationTask,
  dispatch: Dispatch<INotificationAction>
) => {
  try {
    const res = await SimulationAPI.log({ id: simulation.id }, step.systemLog!)
    const log = Buffer.from(res.log).toString()

    Modal.info({
      title: 'System log',
      width: 'unset',
      content: (
        <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
          <pre>
            <code>
              {parse(log.replace(/\n\n/g, '\n').replace(/\n/g, '<br />'))}
            </code>
          </pre>
        </div>
      )
    })
  } catch (err: any) {
    dispatch(addError({ title: errors.log, err }))
  }
}

/**
 * Step
 * @param props Props
 * @returns Step
 */
const Step = ({
  simulation,
  step,
  loading,
  setLoading
}: IStepProps): React.JSX.Element => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On click
   */
  const onClick = useCallback((): void => {
    ;(async () => {
      setLoading(true)
      try {
        await _getCompleteLog(simulation, step, dispatch)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    })()
  }, [simulation, step, setLoading, dispatch])

  // Collapse items
  const collapseItems = useMemo(() => {
    const items = []
    if (step.warning)
      items.push({
        key: 'warnings',
        className: style.warning,
        label: <Typography.Text type="warning">Warnings</Typography.Text>,
        children: parse(
          step.warning.replace(/\n\n/g, '\n').replace(/\n/g, '<br />')
        )
      })

    if (step.error)
      items.push({
        key: 'errors',
        className: style.error,
        label: <Typography.Text type="danger">Errors</Typography.Text>,
        children: parse(
          step.error.replace(/\n\n/g, '\n').replace(/\n/g, '<br />')
        )
      })

    return items
  }, [step])

  /**
   * Render
   */
  return (
    <>
      {step.systemLog && (
        <>
          <Button loading={loading} onClick={onClick}>
            Complete log
          </Button>
          <br />
        </>
      )}
      {step.link && (
        <>
          <a
            href={'https://' + step.link.href}
            target="_blank"
            rel="noreferrer"
          >
            <Button type="primary">{step.link.label}</Button>
          </a>
          <br />
        </>
      )}
      <Collapse ghost items={collapseItems} />
      {parse(
        step.pluginLog
          ?.replace(/\n\n/g, '\n')
          .replace(/\n/g, '<br />')
          .replace(
            /Warning:/g,
            '<span style="color: orange; font-weight: bold;">Info: </span>'
          )
          .replace(
            /Error:/g,
            '<span style="color: red; font-weight: bold;">Error:</span>'
          ) ?? ''
      )}
      {parse(
        step.log
          ?.replace(/^PERCENT.*\n?/gm, '')
          .replace(
            /Info\s*:/g,
            '<span style="color: blue; font-weight: bold;">Info: </span>'
          )
          .replace(
            /Error:/g,
            '<span style="color: red; font-weight: bold;">Error:</span>'
          )
          .replace(/\n\n/g, '\n')
          .replace(/\n/g, '<br />') ?? ''
      )}
    </>
  )
}

/**
 * Log
 * @param props Props
 * @returns Log
 */
const Log = ({ simulation, steps }: IProps): React.JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback((): void => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback((): void => setVisible(false), [])

  /**
   * Render
   */
  return (
    <>
      <Drawer title="Log" open={visible} onClose={setVisibleFalse} width="50%">
        <Tabs
          items={steps?.map((step, index) => ({
            key: '' + index,
            label: step.label,
            children: (
              <Step
                simulation={simulation}
                step={step}
                loading={loading}
                setLoading={setLoading}
              />
            )
          }))}
        />
      </Drawer>
      <Tooltip title="Log">
        <Button
          disabled={!steps?.length}
          icon={<FileTextOutlined />}
          onClick={setVisibleTrue}
        />
      </Tooltip>
    </>
  )
}

export default Log
