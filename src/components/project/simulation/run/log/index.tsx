import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Drawer, Modal, Tabs, Tooltip } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import parse from 'html-react-parser'

import { Error as ErrorNotification } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

import { ISimulation, ISimulationTask } from '@/database/index.d'

export interface IProps {
  simulation: ISimulation
  steps: ISimulationTask[]
}

const errors = {
  logError: 'Unable to get system log'
}

/**
 * Log
 * @param props Props
 */
const Log = ({ simulation, steps }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On log
   */
  const onLog = () => {
    setVisible(true)
  }

  /**
   * Get complete log
   * @param step Step
   */
  const getCompleteLog = async (step: ISimulationTask) => {
    setLoading(true)

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
      ErrorNotification(errors.logError, err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Drawer
        title="Log"
        visible={visible}
        onClose={() => setVisible(false)}
        width={512}
      >
        <Tabs>
          {steps?.map((step) => (
            <Tabs.TabPane tab={step.label} key={step.label}>
              {step.systemLog && (
                <>
                  <Button
                    loading={loading}
                    onClick={() => getCompleteLog(step)}
                  >
                    Complete log
                  </Button>
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
          onClick={() => onLog()}
          size="small"
        />
      </Tooltip>
    </>
  )
}

Log.propTypes = {
  simulation: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  steps: PropTypes.array
}

export default Log
