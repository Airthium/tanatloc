/** @module Components.Project.Simulation.Parameters */

import { useEffect } from 'react'
import { Card, Checkbox, Collapse, Form, Layout, Select, Space } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

import { IModelParameter } from '@/models/index.d'

import Formula from '@/components/assets/formula'
import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'
import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update the simulation'
}

/**
 * Build 2D Formula
 * @param key Key
 * @param child Child
 * @param onValueChange On value change
 * @returns Formula
 */
export const build2DFormula = (
  key: string,
  child: IModelParameter,
  onValueChange: (value: string) => void
): JSX.Element => (
  <Formula
    key={key}
    label={child.label2D || child.label}
    defaultValue={(child.value as string) ?? (child.default as string)}
    onValueChange={onValueChange}
    unit={child.unit}
  />
)

/**
 * Build 2D Select
 * @param key Key
 * @param child Child
 * @param onValueChange On value change
 * @returns Select
 */
export const build2DSelect = (
  key: string,
  child: IModelParameter,
  onValueChange: (value: string) => void
): JSX.Element => (
  <Form layout="vertical" key={key}>
    <Form.Item label={child.label2D || child.label}>
      <Select
        options={child.options?.map((option) => ({
          label: option.label,
          value: option.value2D ?? option.value
        }))}
        defaultValue={
          (child.value as string) ||
          (child.default2D as string) ||
          (child.default as string)
        }
        onChange={onValueChange}
      />
    </Form.Item>
  </Form>
)

/**
 * Build 2D checkbox
 * @param key Key
 * @param child Child
 * @param onValueChange On value change
 * @returns Checkbox
 */
export const build2DCheckbox = (
  key: string,
  child: IModelParameter,
  onValueChange: (e: CheckboxChangeEvent) => void
) => (
  <Form layout="vertical" key={key}>
    <Form.Item label={child.label2D || child.label}>
      <Checkbox
        defaultChecked={child.value as boolean}
        onChange={onValueChange}
      />
    </Form.Item>
  </Form>
)

/**
 * Build Formula
 * @param key Key
 * @param child Child
 * @param onValueChange On value change
 * @returns Formula
 */
export const buildFormula = (
  key: string,
  child: IModelParameter,
  onValueChange: (value: string) => void
) => (
  <Formula
    key={key}
    label={child.label}
    defaultValue={(child.value as string) ?? (child.default as string)}
    onValueChange={onValueChange}
    unit={child.unit}
  />
)

/**
 * Build Select
 * @param key Key
 * @param child Child
 * @param onValueChange On value change
 * @returns Select
 */
export const buildSelect = (
  key: string,
  child: IModelParameter,
  onValueChange: (value: string) => void
) => (
  <Form layout="vertical" key={key}>
    <Form.Item label={child.label}>
      <Select
        options={child.options}
        defaultValue={(child.value as string) || (child.default as string)}
        onChange={onValueChange}
      />
    </Form.Item>
  </Form>
)

/**
 * Build Checkbox
 * @param key Key
 * @param child Child
 * @param onValueChange On value change
 * @returns Checkbox
 */
const buildCheckbox = (
  key: string,
  child: IModelParameter,
  onValueChange: (e: CheckboxChangeEvent) => void
) => (
  <Form layout="vertical" key={key}>
    <Form.Item label={child.label}>
      <Checkbox
        defaultChecked={child.value as boolean}
        onChange={onValueChange}
      />
    </Form.Item>
  </Form>
)

/**
 * On done
 * @param simulation Simulation
 * @param swr SWR
 */
export const onDone = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    const newSimulation = Utils.deepCopy(simulation)

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
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  key: string,
  index: number,
  value: boolean | string,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    const newSimulation = Utils.deepCopy(simulation)

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
  const dimension = simulation?.scheme.configuration.dimension

  // Initial
  useEffect(() => {
    if (!subScheme?.done) {
      onDone(simulation, swr)
    }
  }, [simulation, subScheme, swr])

  // Build parameters
  const parameters: JSX.Element[] = []
  const advanced: JSX.Element[] = []
  if (dimension === 2) {
    Object.keys(subScheme).forEach((key) => {
      if (key === 'index' || key === 'title' || key == 'done') return

      const parameter = subScheme[key] as {
        label: string
        advanced?: boolean
        children: IModelParameter[]
      }

      const components = parameter?.children.map((child, index) => {
        if (child.only3D) return
        if (child.htmlEntity === 'formula') {
          return build2DFormula(key + '&' + index, child, (value: string) =>
            onChange(simulation, key, index, value, swr)
          )
        } else if (child.htmlEntity === 'select') {
          return build2DSelect(key + '&' + index, child, (value: string) =>
            onChange(simulation, key, index, value, swr)
          )
        } else if (child.htmlEntity === 'checkbox') {
          return build2DCheckbox(key + '&' + index, child, (e) =>
            onChange(simulation, key, index, e.target.checked, swr)
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
  } else {
    Object.keys(subScheme).forEach((key) => {
      if (key === 'index' || key === 'title' || key == 'done') return

      const parameter = subScheme[key] as {
        label: string
        advanced?: boolean
        children: IModelParameter[]
      }

      const components = parameter?.children.map((child, index) => {
        if (child.htmlEntity === 'formula') {
          return buildFormula(key + '&' + index, child, (value: string) =>
            onChange(simulation, key, index, value, swr)
          )
        } else if (child.htmlEntity === 'select') {
          return buildSelect(key + '&' + index, child, (value: string) =>
            onChange(simulation, key, index, value, swr)
          )
        } else if (child.htmlEntity === 'checkbox') {
          return buildCheckbox(key + '&' + index, child, (e) =>
            onChange(simulation, key, index, e.target.checked, swr)
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
  }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Space direction="vertical">
          {parameters}
          {/* 
          //@ts-ignore */}
          <Collapse>
            {/* 
            //@ts-ignore */}
            <Collapse.Panel key="advanced" header="Advanced">
              <Space direction="vertical">{advanced}</Space>
            </Collapse.Panel>
          </Collapse>
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Parameters
