import { useEffect } from 'react'
import { message, Layout, Space, Typography } from 'antd'

import Delete from '../delete'

import SimulationAPI from '../../../../../src/api/simulation'

import Sentry from '../../../../../src/lib/sentry'

/**
 * Errors simulation/about
 * @memberof module:renderer/components/project/simulation
 */
const errors = {
  updateError: 'Unable to update the simulation'
}

/**
 * About
 * @memberof module:renderer/components/project/simulation
 * @param {Object} props Props
 */
const About = ({ project, simulation }) => {
  // Data
  const [, { mutateOneSimulation }] = SimulationAPI.useSimulations(
    project?.simulations
  )

  /**
   * Handle name
   * @param {string} name Name
   */
  const handleName = async (name) => {
    try {
      // Update simulation
      await SimulationAPI.update({ id: simulation.id }, [
        { key: 'name', value: name }
      ])

      // Mutate simulation
      mutateOneSimulation({
        ...simulation,
        name: name
      })
    } catch (err) {
      message.error(errors.updateError)
      console.error(err)
      Sentry.captureException(err)
    }
  }

  // MathJax
  /**
   * MatJax
   */
  useEffect(() => {
    window.MathJax?.typeset()
  }, [simulation?.scheme.description])

  return (
    <Layout>
      <Layout.Content>
        <Space direction="vertical">
          <Typography.Title
            level={4}
            editable={{
              onChange: handleName,
              maxLength: 50
            }}
          >
            {simulation?.name}
          </Typography.Title>
          <Typography.Text>
            <b>Category:</b> {simulation?.scheme.category}
          </Typography.Text>
          <Typography.Text>
            <b>Algorihtm:</b> {simulation?.scheme.algorithm}
          </Typography.Text>
          <Typography.Text>
            <b>Code:</b> {simulation?.scheme.code}
          </Typography.Text>

          <div
            dangerouslySetInnerHTML={{
              __html: simulation?.scheme.description
            }}
          />

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
