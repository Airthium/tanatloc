import PropTypes from 'prop-types'
import { Divider, Layout, Space, Spin, Typography } from 'antd'

import { Error as ErrorNotification } from '@/components/assets/notification'

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
const About = ({ simulation, swr }) => {
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

  return (
    <Layout>
      <Layout.Content>
        {simulation ? (
          <Space direction="vertical">
            <Typography.Title
              level={5}
              editable={{
                onChange: handleName,
                maxLength: 50
              }}
            >
              {simulation.name}
            </Typography.Title>
            <Typography.Text>
              <b>Category:</b> {simulation.scheme?.category}
            </Typography.Text>
            <Typography.Text>
              <b>Algorithm:</b> {simulation.scheme?.algorithm}
            </Typography.Text>
            <Typography.Text>
              <b>Code:</b> {simulation.scheme?.code}
            </Typography.Text>

            <div
              dangerouslySetInnerHTML={{
                __html: simulation.scheme?.description
              }}
            />

            <Divider type="horizontal" />

            <Delete
              simulation={{ id: simulation.id, name: simulation.name }}
              swr={{
                reloadProject: swr.reloadProject,
                delOneSimulation: swr.delOneSimulation
              }}
            />
          </Space>
        ) : (
          <Spin />
        )}
      </Layout.Content>
    </Layout>
  )
}

About.propTypes = {
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    scheme: PropTypes.object
  }),
  swr: PropTypes.exact({
    reloadProject: PropTypes.func.isRequired,
    delOneSimulation: PropTypes.func.isRequired,
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default About
