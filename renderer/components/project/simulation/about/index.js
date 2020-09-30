import { message, Layout, Space, Typography } from 'antd'

import Delete from '../delete'

import { useSimulations, update } from '../../../../../src/api/simulation'

import Sentry from '../../../../../src/lib/sentry'

const About = ({ project, simulation }) => {
  // Data
  const [, { mutateOneSimulation }] = useSimulations(project?.simulations)

  /**
   * Handle name
   * @param {string} name Name
   */
  const handleName = async (name) => {
    try {
      // Update simulation
      await update({ id: simulation.id }, [{ key: 'name', value: name }])

      // Mutate simulation
      mutateOneSimulation({
        ...simulation,
        name: name
      })
    } catch (err) {
      message.error(err.message)
      console.error(err)
      Sentry.captureException(err)
    }
  }

  return (
    <Layout>
      <Layout.Content>
        <Space direction="vertical">
          <Typography.Text>
            Category: {simulation?.scheme.category}
          </Typography.Text>
          <Typography.Text>
            Algorihtm: {simulation?.scheme.algorithm}
          </Typography.Text>
          <Typography.Title
            level={4}
            editable={{
              onChange: handleName,
              maxLength: 50
            }}
          >
            {simulation?.name}
          </Typography.Title>
          <Delete
            project={project}
            simulation={{ id: simulation?.id, name: simulation?.name }}
          />
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default About
