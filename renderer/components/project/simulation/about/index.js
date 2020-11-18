import { useEffect } from 'react'
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

          <p>
            <div
              dangerouslySetInnerHTML={{
                __html: simulation?.scheme.description
              }}
            />
          </p>

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
