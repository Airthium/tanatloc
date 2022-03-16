/** @module Components.Project.Simulation.Run.Log */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button, Drawer, Modal, Tabs, Tooltip } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import parse from 'html-react-parser'

import { ErrorNotification } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

import { ISimulation, ISimulationTask } from '@/database/index.d'

/**
 * Props
 */
export interface IProps {
  simulation: ISimulation
  steps: ISimulationTask[]
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
export const getCompleteLog = async (
  simulation: ISimulation,
  step: ISimulationTask
) => {
  try {
    const res = await SimulationAPI.log({ id: simulation.id }, step.systemLog)
    const log = Buffer.from(res.log).toString()

    Modal.info({
      title: 'System log',
      width: 'unset',
      content: (
        <pre>
          <code>
            {parse(log.replace(/\n\n/g, '\n').replace(/\n/g, '<br />'))}
          </code>
        </pre>
      )
    })
  } catch (err) {
    ErrorNotification(errors.log, err)
  }
}

/**
 * Log
 * @param props Props
 * @returns Log
 */
const Log = ({ simulation, steps }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  console.log(steps)

  /**
   * Render
   */
  return (
    <>
      <Drawer
        title="Log"
        visible={visible}
        onClose={() => setVisible(false)}
        width="50%"
      >
        <Tabs>
          {steps?.map((step) => (
            <Tabs.TabPane tab={step.label} key={step.label}>
              {step.systemLog && (
                <>
                  <Button
                    loading={loading}
                    onClick={async () => {
                      setLoading(true)
                      try {
                        await getCompleteLog(simulation, step)
                      } catch (err) {
                      } finally {
                        setLoading(false)
                      }
                    }}
                  >
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
                    {step.link.label}
                  </a>
                  <br />
                </>
              )}
              {parse(
                step.pluginLog
                  ?.replace(/\n\n/g, '\n')
                  .replace(/\n/g, '<br />') || ''
              )}
              {parse(
                step.log?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />') || ''
              )}
              {parse(
                step.warning?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />') ||
                  ''
              )}
              {parse(
                step.error?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />') ||
                  ''
              )}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Drawer>
      <Tooltip title="Log">
        <Button
          disabled={!steps || !steps.length}
          icon={<FileTextOutlined />}
          onClick={() => setVisible(true)}
        />
      </Tooltip>
    </>
  )
}

Log.propTypes = {
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired
  }).isRequired,
  steps: PropTypes.array
}

export default Log
