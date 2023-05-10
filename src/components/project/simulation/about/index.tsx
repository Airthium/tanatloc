/** @module Components.Project.Simulation.About*/

import { Alert, Card, Layout, Space, Spin, Typography } from 'antd'

import {
  IFrontProject,
  IFrontSimulationsItem,
  IFrontMutateProject,
  IFrontNewSimulation,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import MathJax from '@/components/assets/mathjax'

import Copy from '../copy'
import Edit from './edit'
import Delete from '../delete'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  project?: Pick<IFrontProject, 'id' | 'simulations'>
  simulation?: Pick<IFrontSimulationsItem, 'id' | 'name' | 'scheme'>
  swr: {
    mutateProject: (project: IFrontMutateProject) => Promise<void>
    addOneSimulation: (simulation: IFrontNewSimulation) => Promise<void>
    delOneSimulation: (simulation: IFrontMutateSimulationsItem) => Promise<void>
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
}

/**
 * About
 * @param props Props
 * @returns About
 */
const About = ({ project, simulation, swr }: IProps): React.JSX.Element => {
  /**
   * Render
   */
  if (!project || !simulation)
    return (
      <Card>
        <Spin />
      </Card>
    )
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
          <Space direction="vertical" className={globalStyle.fullWidth}>
            {simulation.scheme.user && (
              <Alert message="User algorithm" type="info" showIcon />
            )}
            <Typography.Text>
              <span className={globalStyle.textLight}>Category:</span>{' '}
              {simulation.scheme.category}
            </Typography.Text>
            <Typography.Text>
              <span className={globalStyle.textLight}>Algorithm:</span>{' '}
              {simulation.scheme.algorithm}
            </Typography.Text>
            <Typography.Text>
              <span className={globalStyle.textLight}>Code:</span>{' '}
              {simulation.scheme.code}
            </Typography.Text>
            <Typography.Text>
              <span className={globalStyle.textLight}>Version:</span>{' '}
              {simulation.scheme.version}
            </Typography.Text>

            <div className={`${globalStyle.fullWidth} ${globalStyle.scroll}`}>
              <MathJax.Html html={simulation.scheme.description} />
            </div>
          </Space>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

export default About
