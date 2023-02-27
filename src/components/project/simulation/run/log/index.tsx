/** @module Components.Project.Simulation.Run.Log */

import { Dispatch, SetStateAction, useCallback, useState } from 'react'
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

import { ErrorNotification } from '@/components/assets/notification'

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
  step: IFrontSimulationTask
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
  } catch (err) {
    ErrorNotification(errors.log, err)
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
}: IStepProps): JSX.Element => {
  /**
   * On click
   */
  const onClick = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _getCompleteLog(simulation, step)
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }, [simulation, step, setLoading])

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
      <Collapse ghost>
        {step.warning && (
          <Collapse.Panel
            key="warnings"
            className={style.warning}
            header={<Typography.Text type="warning">Warnings</Typography.Text>}
          >
            {parse(
              step.warning.replace(/\n\n/g, '\n').replace(/\n/g, '<br />')
            )}
          </Collapse.Panel>
        )}
        {step.error && (
          <Collapse.Panel
            key="errors"
            className={style.error}
            header={<Typography.Text type="danger">Errors</Typography.Text>}
          >
            {parse(step.error.replace(/\n\n/g, '\n').replace(/\n/g, '<br />'))}
          </Collapse.Panel>
        )}
      </Collapse>
      {parse(
        step.pluginLog?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />') || ''
      )}
      {parse(
        step.log
          ?.replace(/\n\n/g, '\n')
          .replace(/\n/g, '<br />')
          .replace(
            /Info\s*:/g,
            '<span style="color: blue; font-weight: bold;">Info: </span>'
          )
          .replace(
            /Error:/g,
            '<span style="color: red; font-weight: bold;">Error:</span>'
          ) || ''
      )}
    </>
  )
}

/**
 * Log
 * @param props Props
 * @returns Log
 */
const Log = ({ simulation, steps }: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback(() => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [])

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
          disabled={!steps || !steps.length}
          icon={<FileTextOutlined />}
          onClick={setVisibleTrue}
        />
      </Tooltip>
    </>
  )
}

export default Log
