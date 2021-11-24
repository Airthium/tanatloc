import PropTypes from 'prop-types'
import { Card, Layout, Space, Spin, Typography } from 'antd'
import { MathJax } from 'better-react-mathjax'

import { ISimulation } from '@/database/index.d'
import { IProjectWithData } from '@/lib/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'

import Copy from '../copy'
import Delete from '../delete'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  project?: IProjectWithData
  simulation?: ISimulation
  swr: {
    mutateProject: Function
    addOneSimulation: Function
    delOneSimulation: Function
    mutateOneSimulation: Function
  }
}

/**
 * Errors (about)
 * @memberof Components.Project.Simulation
 */
const errors = {
  update: 'Unable to update the simulation'
}

/**
 * About
 * @memberof Components.Project.Simulation
 * @param props Props
 */
const About = ({ project, simulation, swr }: IProps): JSX.Element => {
  /**
   * Handle name
   * @param name Name
   */
  const handleName = async (name: string): Promise<void> => {
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
  if (!project || !simulation)
    return (
      <Card>
        <Spin />
      </Card>
    )
  else
    return (
      <Layout>
        <Layout.Content>
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
                project={{
                  id: project.id,
                  simulations: project.simulations
                }}
                simulation={simulation}
                swr={{
                  mutateProject: swr.mutateProject,
                  addOneSimulation: swr.addOneSimulation
                }}
              />,
              <Delete
                key="delete"
                project={{ id: project.id, simulations: project.simulations }}
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

              <MathJax dynamic>
                <div
                  dangerouslySetInnerHTML={{
                    __html: simulation.scheme?.description
                  }}
                />
              </MathJax>
            </Space>
          </Card>
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
