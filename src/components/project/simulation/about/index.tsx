/** @module Components.Project.Simulation.About*/

import { Card, Layout, Space, Spin, Typography } from 'antd'

import MathJax from '@/components/assets/mathjax'

import {
  IFrontProject,
  IFrontSimulationsItem,
  IFrontMutateProject,
  IFrontNewSimulation,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import Copy from '../copy'
import Edit from './edit'
import Delete from '../delete'

/**
 * Props
 */
export interface IProps {
  project?: Pick<IFrontProject, 'id' | 'simulations'>
  simulation?: Pick<IFrontSimulationsItem, 'id' | 'name' | 'scheme'>
  swr: {
    mutateProject: (project: IFrontMutateProject) => void
    addOneSimulation: (simulation: IFrontNewSimulation) => void
    delOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

/**
 * About
 * @param props Props
 * @returns About
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

export default About
