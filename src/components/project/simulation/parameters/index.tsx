/** @module Components.Project.Simulation.Parameters */

import PropTypes from 'prop-types'
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback
} from 'react'
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
 * Parameters
 * @param props Props
 * @returns Parameters
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
  }, [, /*simulation*/ values, swr])

  /**
   * On parameter change
   * @param key Parameter key
   * @param index Children index
   * @param value Value
   */
  const onChange = useCallback(
    (key: string, index: number, value: boolean | string): void => {
      const deepValues = values[key] || []
      deepValues[index] = value

      setValues((prevValues) => ({
        ...prevValues,
        [key]: deepValues
      }))
    },
    [values]
  )

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
              onValueChange={(value: string) => onChange(key, index, value)}
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
              onChange={(value: string) => onChange(key, index, value)}
            />
          </Typography.Text>
        )
      } else if (child.htmlEntity === 'checkbox') {
        return (
          <Typography.Text key={key + '&' + index}>
            {child.label}:<br />
            <Checkbox
              defaultChecked={child.value as boolean}
              onChange={(e) => onChange(key, index, e.target.checked)}
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
