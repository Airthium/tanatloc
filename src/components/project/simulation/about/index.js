import PropTypes from 'prop-types'
import { Card, Layout, Space, Spin, Typography } from 'antd'

import { Error as ErrorNotification } from '@/components/assets/notification'

import Copy from '../copy'
import Delete from '../delete'

import SimulationAPI from '@/api/simulation'

/**
 * Errors simulation/about
 * @memberof module:components/project/simulation
 */
const errors = {
  update: 'Unable to update the simulation'
}

/**
 * About
 * @memberof module:components/project/simulation
 * @param {Object} props Props
 */
const About = ({ project, simulation, swr }) => {
  /**
   * Handle name
   * @param {string} name Name
   */
  const handleName = async (name) => {
    try {
      // API
      await SimulationAPI.update({ id: simulation.id }, [
        { key: 'name', value: name }
      ])

      // Local
      swr.mutateOneSimulation({
        id: simulation.id,
        name: name
      })
    } catch (err) {
      ErrorNotification(errors.update, err)
    }
  }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        {simulation ? (
          <Card
            title={
              <Typography.Title
                level={5}
                ellipsis={true}
                editable={{
                  onChange: handleName,
                  maxLength: 50
                }}
              >
                {simulation.name}
              </Typography.Title>
            }
            actions={[
              <Copy
                key="copy"
                project={project}
                simulation={simulation}
                swr={{
                  mutateProject: swr.mutateProject,
                  addOneSimulation: swr.addOneSimulation
                }}
              />,
              <Delete
                key="delete"
                project={{ simulations: project.simulations }}
                simulation={{ id: simulation.id, name: simulation.name }}
                swr={{
                  mutateProject: swr.mutateProject,
                  delOneSimulation: swr.delOneSimulation
                }}
              />
            ]}
          >
            <Space direction="vertical">
              <Typography.Text>
                <b>Category:</b> {simulation.scheme?.category}
              </Typography.Text>
              <Typography.Text>
                <b>Algorithm:</b> {simulation.scheme?.algorithm}
              </Typography.Text>
              <Typography.Text>
                <b>Code:</b> {simulation.scheme?.code}
              </Typography.Text>
              <Typography.Text>
                <b>Version:</b> {simulation.scheme?.version}
              </Typography.Text>

              <div
                dangerouslySetInnerHTML={{
                  __html: simulation.scheme?.description
                }}
              />
            </Space>
          </Card>
        ) : (
          <Card>
            <Spin />
          </Card>
        )}
      </Layout.Content>
    </Layout>
  )
}

About.propTypes = {
  project: PropTypes.exact({
    id: PropTypes.string.isRequired,
    simulations: PropTypes.array.isRequired
  }),
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    scheme: PropTypes.object
  }),
  swr: PropTypes.exact({
    mutateProject: PropTypes.func.isRequired,
    addOneSimulation: PropTypes.func.isRequired,
    delOneSimulation: PropTypes.func.isRequired,
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default About
