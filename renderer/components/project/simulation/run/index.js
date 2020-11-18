import { Button, Layout } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import { update, useSimulations } from '../../../../../src/api/simulation'

const Run = ({ project, simulation }) => {
  // Data
  const subScheme = simulation?.scheme.categories.run
  const [, { mutateOneSimulation }] = useSimulations(project?.simulations)

  const addRun = () => {
    // TODO just for test
    const newSimulation = { ...simulation }

    // Update local
    newSimulation.scheme.categories.run.subMenus = [{ title: 'Run 1' }]

    // Diff
    const diff = {
      ...newSimulation.scheme.categories.run,
      done: true
    }

    // Update
    update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'diff',
        path: ['categories', 'run'],
        value: diff
      }
    ]).then(() => {
      // Mutate
      mutateOneSimulation(newSimulation)
    })
  }

  return (
    <Layout>
      <Layout.Content>
        <Button icon={<PlusCircleOutlined />} onClick={addRun}>
          Add a run
        </Button>
      </Layout.Content>
    </Layout>
  )
}

export default Run
