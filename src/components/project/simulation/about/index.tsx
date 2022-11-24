/** @module Components.Project.Simulation.About*/

import { Alert, Card, Layout, Space, Spin, Typography } from 'antd'
import { css } from '@emotion/react'

import MathJax from '@/components/assets/mathjax'

import {
  IFrontProject,
  IFrontSimulationsItem,
  IFrontMutateProject,
  IFrontNewSimulation,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { globalStyle } from '@/styles'

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
            <Space direction="vertical" css={globalStyle.fullWidth}>
              {simulation.scheme.user && (
                <Alert message="User algorithm" type="info" showIcon />
              )}
              <Typography.Text>
                <span css={globalStyle.textLight}>Category:</span>{' '}
                {simulation.scheme.category}
              </Typography.Text>
              <Typography.Text>
                <span css={globalStyle.textLight}>Algorithm:</span>{' '}
                {simulation.scheme.algorithm}
              </Typography.Text>
              <Typography.Text>
                <span css={globalStyle.textLight}>Code:</span>{' '}
                {simulation.scheme.code}
              </Typography.Text>
              <Typography.Text>
                <span css={globalStyle.textLight}>Version:</span>{' '}
                {simulation.scheme.version}
              </Typography.Text>

              <div css={css([globalStyle.fullWidth, globalStyle.scroll])}>
                <MathJax.Html html={simulation.scheme.description} />
              </div>
            </Space>
          </Card>
        </Layout.Content>
      </Layout>
    )
}

export default About
