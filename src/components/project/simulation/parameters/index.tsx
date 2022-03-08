/** @module Components.Project.Simulation.Parameters */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
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

export interface IProps {
  simulation: ISimulation
  swr: {
    mutateOneSimulation: Function
  }
}

/**
 * Errors (parameters)
 */
const errors = {
  update: 'Unable to update the simulation'
}

/**
 * On parameter change
 * @param key Parameter key
 * @param index Children index
 * @param value Value
 */
export const onChange = (
  key: string,
  index: number,
  value: boolean | string,
  values: { [key: string]: string[] | boolean[] }
): { [key: string]: string[] | boolean[] } => {
  const deepValues = values[key] || []
  deepValues[index] = value
  return {
    ...values,
    [key]: deepValues
  }
}

/**
 * Parameters
 * @param props Props
 */
const Parameters = ({ simulation, swr }: IProps): JSX.Element => {
  // State
  const [values, setValues]: [
    { [key: string]: string[] | boolean[] },
    Dispatch<SetStateAction<{ [key: string]: string[] | boolean[] }>>
  ] = useState({})

  // Data
  const subScheme = simulation?.scheme.configuration.parameters

  // Effect
  useEffect(() => {
    const newSimulation = { ...simulation }

    // Update local
    Object.keys(values).forEach((key) => {
      const deepValues = values[key]
      deepValues.forEach((value: string | boolean, index: number) => {
        if (value !== undefined) {
          const parameter = newSimulation.scheme.configuration.parameters[
            key
          ] as {
            label: string
            advanced?: boolean
            children: IModelParameter[]
          }
          parameter.children[index].value = value
        }
      })
    })

    // Diff
    const diff = {
      ...newSimulation.scheme.configuration.parameters,
      done: true
    }

    // API
    SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'parameters'],
        value: diff
      }
    ])
      .then(() => {
        // Local
        swr.mutateOneSimulation(newSimulation)
      })
      .catch((err) => {
        ErrorNotification(errors.update, err)
      })
  }, [values])

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
              onValueChange={(value: string) => {
                let newValues = onChange(key, index, value, values)
                setValues(newValues)
              }}
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
              onChange={(value: string) => {
                let newValues = onChange(key, index, value, values)
                setValues(newValues)
              }}
            />
          </Typography.Text>
        )
      } else if (child.htmlEntity === 'checkbox') {
        return (
          <Typography.Text key={key + '&' + index}>
            {child.label}:<br />
            <Checkbox
              defaultChecked={child.value as boolean}
              onChange={(e) => {
                let newValues = onChange(key, index, e.target.checked, values)
                setValues(newValues)
              }}
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
