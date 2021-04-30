import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { Layout, Space, Typography } from 'antd'

import { Error } from '@/components/assets/notification'

import Delete from '../delete'

import SimulationAPI from '@/api/simulation'

/**
 * Errors simulation/about
 * @memberof module:components/project/simulation
 */
const errors = {
  updateError: 'Unable to update the simulation'
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
        ...simulation,
        name: name
      })
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  // MathJax
  useEffect(() => {
    window.MathJax?.typeset()
  }, [simulation.scheme?.description])

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

          <Delete
            simulation={{ id: simulation.id, name: simulation.name }}
            swr={{
              reloadProject: swr.reloadProject,
              delOneSimulation: swr.delOneSimulation
            }}
          />
        </Space>
      </Layout.Content>
    </Layout>
  )
}

About.propTypes = {
  simulation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    scheme: PropTypes.object
  }).isRequired,
  swr: PropTypes.shape({
    reloadProject: PropTypes.func.isRequired,
    delOneSimulation: PropTypes.func.isRequired,
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default About
