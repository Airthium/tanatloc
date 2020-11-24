import { useState } from 'react'
import { message, Button, Layout, Steps } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import SimulationAPI from '../../../../../src/api/simulation'

import Sentry from '../../../../../src/lib/sentry'

const Run = ({ project, simulation }) => {
  // State
  const [running, setRunning] = useState(false)

  // Data
  // const subScheme = simulation?.scheme.categories.run
  // const [, { mutateOneSimulation }] = useSimulations(project?.simulations)

  // const addRun = () => {
  //   // TODO just for test
  //   const newSimulation = { ...simulation }

  //   // Update local
  //   if (!newSimulation.scheme.categories.run.subMenus)
  //     newSimulation.scheme.categories.run.subMenus = []
  //   newSimulation.scheme.categories.run.subMenus.push({
  //     title: 'Run ' + (subScheme.subMenus.length + 1)
  //   })

  //   // Diff
  //   const diff = {
  //     ...newSimulation.scheme.categories.run,
  //     done: true
  //   }

  //   // Update
  //   update({ id: simulation.id }, [
  //     {
  //       key: 'scheme',
  //       type: 'json',
  //       method: 'diff',
  //       path: ['categories', 'run'],
  //       value: diff
  //     }
  //   ]).then(() => {
  //     // Mutate
  //     mutateOneSimulation(newSimulation)
  //   })
  // }

  const onRun = async () => {
    setRunning(true)

    try {
      await SimulationAPI.run({ id: simulation.id })
    } catch (err) {
      message.error(err.message)
      console.error(err)
      Sentry.captureException(err)
    } finally {
      setRunning(false)
    }
  }

  return (
    <Layout>
      <Layout.Content>
        <Button icon={<PlusCircleOutlined />} loading={running} onClick={onRun}>
          Run
        </Button>
        <Steps direction="vertical" percent="45">
          <Steps.Step title="Meshing" status="process" />
          <Steps.Step title="Simulating" status="wait" />
        </Steps>
      </Layout.Content>
    </Layout>
  )
}

export default Run
