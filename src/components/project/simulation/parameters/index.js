import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import {
  Card,
  Checkbox,
  Collapse,
  Layout,
  Select,
  Space,
  Typography
} from 'antd'

import Formula from '@/components/assets/formula'
import { Error as ErrorNotification } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

/**
 * Errors (parameters)
 * @memberof Components.Project.Simulation
 */
const errors = {
  update: 'Unable to update the simulation'
}

/**
 * Parameters
 * @memberof Components.Project.Simulation
 * @param {Object} props Props
 */
const Parameters = ({ simulation, swr }) => {
  // State
  const [values, setValues] = useState({})

  // Data
  const subScheme = simulation?.scheme.configuration.parameters

  // Effect
  useEffect(() => {
    const newSimulation = { ...simulation }

    // Update local
    Object.keys(values).forEach((key) => {
      const deepValues = values[key]
      deepValues.forEach((value, index) => {
        if (value !== undefined)
          newSimulation.scheme.configuration.parameters[key].children[
            index
          ].value = value
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

  /**
   * On parameter change
   * @param {string} key Parameter key
   * @param {number} index Children index
   * @param {string} value Value
   */
  const onChange = (key, index, value) => {
    const deepValues = values[key] || []
    deepValues[index] = value
    const newValues = {
      ...values,
      [key]: deepValues
    }

    setValues(newValues)
  }

  // Build parameters
  const parameters = []
  const advanced = []
  Object.keys(subScheme).forEach((key) => {
    if (key === 'index' || key === 'title' || key == 'done') return

    const parameter = subScheme[key]

    const components = parameter?.children.map((child, index) => {
      if (child.htmlEntity === 'formula') {
        return (
          <Typography.Text key={key + '&' + index}>
            {child.label}:<br />
            <Formula
              defaultValue={
                child.value === undefined ? child.default : child.value
              }
              onValueChange={(value) => onChange(key, index, value)}
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
              defaultValue={child.value || child.default}
              onChange={(value) => onChange(key, index, value)}
            />
          </Typography.Text>
        )
      } else if (child.htmlEntity === 'checkbox') {
        return (
          <Typography.Text key={key + '&' + index}>
            {child.label}:<br />
            <Checkbox
              defaultChecked={child.value}
              onChange={(e) => onChange(key, index, e.target.checked)}
            />
          </Typography.Text>
        )
      }
    })

    if (parameter?.advanced) {
      advanced.push(
        <Card key={key} title={parameter?.label}>
          <Space direction="vertical">{components}</Space>
        </Card>
      )
    } else {
      parameters.push(
        <Card key={key} title={parameter?.label}>
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
            <Collapse.Panel header="Advanced">
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
