/** @module Components.Project.Simulation.Parameters */

import PropTypes from 'prop-types'
import { useEffect } from 'react'
import {
  Card,
  Checkbox,
  Collapse,
  Layout,
  Select,
  Space,
  Typography
} from 'antd'

import { ISimulation } from '@/database/index.d'
import { IModelParameter } from '@/models/index.d'

import Formula from '@/components/assets/formula'
import { ErrorNotification } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: ISimulation
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update the simulation'
}

/**
 * On done
 * @param simulation Simulation
 * @param swr SWR
 */
export const onDone = async (
  simulation: ISimulation,
  swr: IProps['swr']
): Promise<void> => {
  try {
    const newSimulation = { ...simulation }

    // Update local
    const parameters = newSimulation.scheme.configuration.parameters

    // Diff
    const diff = {
      ...parameters,
      done: true
    }

    // API
    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'parameters'],
        value: diff
      }
    ])

    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
  }
}

/**
 * On change
 * @param simulation Simulation
 * @param key Key
 * @param index Index
 * @param value Value
 * @param swr SWR
 */
export const onChange = async (
  simulation: ISimulation,
  key: string,
  index: number,
  value: boolean | string,
  swr: IProps['swr']
): Promise<void> => {
  try {
    const newSimulation = { ...simulation }

    // Update local
    const parameters = newSimulation.scheme.configuration.parameters
    const parameter = parameters[key] as {
      label: string
      advanced?: boolean
      children: IModelParameter[]
    }
    parameter.children[index].value = value

    // Diff
    const diff = {
      ...parameters,
      done: true
    }

    // API
    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'parameters'],
        value: diff
      }
    ])

    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
  }
}

/**
 * Parameters
 * @param props Props
 * @returns Parameters
 */
const Parameters = ({ simulation, swr }: IProps): JSX.Element => {
  // Data
  const subScheme = simulation?.scheme.configuration.parameters

  // Initial
  useEffect(() => {
    if (!subScheme?.done) {
      onDone(simulation, swr)
    }
  }, [simulation, subScheme, swr])

  // Build parameters
  const parameters = []
  const advanced = []
  Object.keys(subScheme).forEach((key) => {
    if (key === 'index' || key === 'title' || key == 'done') return

    const parameter = subScheme[key] as {
      label: string
      advanced?: boolean
      children: IModelParameter[]
    }

    const components = parameter?.children.map((child, index) => {
      if (child.htmlEntity === 'formula') {
        return (
          <Typography.Text key={key + '&' + index}>
            {child.label}:<br />
            <Formula
              defaultValue={
                child.value === undefined
                  ? (child.default as string)
                  : (child.value as string)
              }
              onValueChange={(value: string) =>
                onChange(simulation, key, index, value, swr)
              }
              unit={child.unit}
            />
          </Typography.Text>
        )
      } else if (child.htmlEntity === 'select') {
        return (
          <Typography.Text key={key + '&' + index}>
            {child.label}:<br />
            <Select
              options={child.options}
              defaultValue={
                (child.value as string) || (child.default as string)
              }
              onChange={(value: string) =>
                onChange(simulation, key, index, value, swr)
              }
            />
          </Typography.Text>
        )
      } else if (child.htmlEntity === 'checkbox') {
        return (
          <Typography.Text key={key + '&' + index}>
            {child.label}:<br />
            <Checkbox
              defaultChecked={child.value as boolean}
              onChange={(e) =>
                onChange(simulation, key, index, e.target.checked, swr)
              }
            />
          </Typography.Text>
        )
      }
    })

    if (parameter?.advanced) {
      advanced.push(
        <Card size="small" key={key} title={parameter?.label}>
          <Space direction="vertical">{components}</Space>
        </Card>
      )
    } else {
      parameters.push(
        <Card size="small" key={key} title={parameter?.label}>
          <Space direction="vertical">{components}</Space>
        </Card>
      )
    }
  })

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Space direction="vertical">
          {parameters}
          <Collapse>
            <Collapse.Panel key="advanced" header="Advanced">
              <Space direction="vertical">{advanced}</Space>
            </Collapse.Panel>
          </Collapse>
        </Space>
      </Layout.Content>
    </Layout>
  )
}

Parameters.propTypes = {
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        parameters: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  })
}

export default Parameters
