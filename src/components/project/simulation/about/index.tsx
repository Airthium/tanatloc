/** @module Components.Project.Simulation.About*/

import PropTypes from 'prop-types'
import { Card, Layout, Space, Spin, Typography } from 'antd'

import { ISimulation } from '@/database/index.d'
import { IProjectWithData } from '@/lib/index.d'

import MathJax from '@/components/assets/mathjax'

import Copy from '../copy'
import Edit from './edit'
import Delete from '../delete'

export interface IProps {
  project?: IProjectWithData
  simulation?: ISimulation
  swr: {
    mutateProject: (project: IProjectWithData) => void
    addOneSimulation: (simulation: ISimulation) => void
    delOneSimulation: (simulation: ISimulation) => void
    mutateOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * About
 * @param props Props
 */
const About = ({ project, simulation, swr }: IProps): JSX.Element => {
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
            size="small"
            title={
              <Typography.Title level={5} ellipsis={true}>
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
              <Edit
                key="edit"
                simulation={{ id: simulation.id, name: simulation.name }}
                swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
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
            <Space direction="vertical" className="full-width">
              <Typography.Text>
                <span className="text-light">Category:</span>{' '}
                {simulation.scheme.category}
              </Typography.Text>
              <Typography.Text>
                <span className="text-light">Algorithm:</span>{' '}
                {simulation.scheme.algorithm}
              </Typography.Text>
              <Typography.Text>
                <span className="text-light">Code:</span>{' '}
                {simulation.scheme.code}
              </Typography.Text>
              <Typography.Text>
                <span className="text-light">Version:</span>{' '}
                {simulation.scheme.version}
              </Typography.Text>

              <div className="full-wdith scroll">
                <MathJax.Html html={simulation.scheme.description} />
              </div>
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
    scheme: PropTypes.shape({
      category: PropTypes.string,
      algorithm: PropTypes.string,
      code: PropTypes.string,
      version: PropTypes.string,
      description: PropTypes.string
    }).isRequired
  }),
  swr: PropTypes.exact({
    mutateProject: PropTypes.func.isRequired,
    addOneSimulation: PropTypes.func.isRequired,
    delOneSimulation: PropTypes.func.isRequired,
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default About
