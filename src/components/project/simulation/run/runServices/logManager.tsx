import { Error as ErrorNotification } from '@/components/assets/notification'
import SimulationAPI from '@/api/simulation'
import { Button, Modal, Tabs, Typography } from 'antd'
import parse from 'html-react-parser'

const errors = {
  runError: 'Unable to run the simulation',
  stopError: 'Unable to stop the simulation',
  updateError: 'Unable to update the simulation',
  downloadError: 'Unable to download the file',
  logError: 'Unable to get system log'
}

const onLogSetup = (
  task,
  title: string,
  logLoading: boolean,
  simulation,
  setLogLoading: Function
) => {
  // Content
  const content = (
    <Tabs.TabPane tab={title}>
      {task?.systemLog && (
        <Button
          loading={logLoading}
          onClick={() => getLogData(task.systemLog, simulation, setLogLoading)}
        >
          Complete log
        </Button>
      )}
      {parse(
        task?.pluginLog?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />') || ''
      )}
      {parse(task?.log?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />') || '')}
      {parse(
        task?.warning?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />') || ''
      )}
      {parse(
        task?.error?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />') || ''
      )}
    </Tabs.TabPane>
  )
  return <Tabs>{content}</Tabs>
}

const getLogData = async (
  link: string,
  simulation,
  setLogLoading: Function
) => {
  setLogLoading(true)
  try {
    const res = await SimulationAPI.log({ id: simulation.id }, link)
    const log = Buffer.from(res.log).toString()

    Modal.info({
      title: 'System log',
      width: 'unset',
      content: (
        <Typography.Paragraph code copyable>
          {parse(log.replace(/\n\n/g, '\n').replace(/\n/g, '<br />'))}
        </Typography.Paragraph>
      )
    })
  } catch (err) {
    ErrorNotification(errors.logError, err)
  } finally {
    setLogLoading(false)
  }
}

export { onLogSetup, getLogData }
