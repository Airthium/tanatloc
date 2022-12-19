/** @module Components.Project.Simulation.Parameters */

import { useCallback, useEffect, useMemo } from 'react'
import { Card, Checkbox, Collapse, Form, Layout, Select, Space } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'
import { IModelParameter } from '@/models/index.d'

import Formula from '@/components/assets/formula'
import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

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

export interface IParameterProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  dimension: number | undefined
  key: string
  parameter: {
    label: string
    advanced?: boolean
    children: IModelParameter[]
  }
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

export interface IParameterChildProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  dimension: number | undefined
  child: any
  key: string
  index: number
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update simulation'
}

/**
 * Build 2D Formula
 * @param key Key
 * @param child Child
 * @param onValueChange On value change
 * @returns Formula
 */
export const _build2DFormula = (
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
export const _build2DSelect = (
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
export const _build2DCheckbox = (
  key: string,
  child: IModelParameter,
  onValueChange: (e: CheckboxChangeEvent) => void
) => (
  <Form layout="horizontal" key={key}>
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
export const _buildFormula = (
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
export const _buildSelect = (
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
export const _buildCheckbox = (
  key: string,
  child: IModelParameter,
  onValueChange: (e: CheckboxChangeEvent) => void
) => (
  <Form layout="horizontal" key={key}>
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
export const _onDone = async (
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
    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'run'],
        value: {
          ...newSimulation.scheme.configuration.run,
          done: false
        }
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
export const _onChange = async (
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
    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'run'],
        value: {
          ...newSimulation.scheme.configuration.run,
          done: false
        }
      }
    ])

    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
  }
}

/**
 * ParameterChild
 * @param props Props
 * @returns ParameterChild
 */
const ParameterChild = ({
  simulation,
  dimension,
  child,
  key,
  index,
  swr
}: IParameterChildProps): JSX.Element | null => {
  /**
   * On change
   * @param value Value
   */
  const onChange = useCallback(
    (value: string) => _onChange(simulation, key, index, value, swr),
    [simulation, key, index, swr]
  )

  /**
   * On change (event)
   * @param e Event
   */
  const onChangeEvent = useCallback(
    (e: CheckboxChangeEvent) =>
      _onChange(simulation, key, index, e.target.checked, swr),
    [simulation, key, index, swr]
  )

  /**
   * Render
   */
  if (dimension === 2) {
    if (child.only3D) return null
    else if (child.htmlEntity === 'formula') {
      return _build2DFormula(key + '&' + index, child, onChange)
    } else if (child.htmlEntity === 'select') {
      return _build2DSelect(key + '&' + index, child, onChange)
    } else if (child.htmlEntity === 'checkbox') {
      return _build2DCheckbox(key + '&' + index, child, onChangeEvent)
    }
    return null
  } else {
    if (child.htmlEntity === 'formula') {
      return _buildFormula(key + '&' + index, child, onChange)
    } else if (child.htmlEntity === 'select') {
      return _buildSelect(key + '&' + index, child, onChange)
    } else if (child.htmlEntity === 'checkbox') {
      return _buildCheckbox(key + '&' + index, child, onChangeEvent)
    }
    return null
  }
}

/**
 * Parameter
 * @param props Props
 * @returns Parameter
 */
const Parameter = ({
  simulation,
  dimension,
  key,
  parameter,
  swr
}: IParameterProps): JSX.Element => {
  // Components
  const components = useMemo(
    () =>
      parameter.children.map((child, index) => (
        <ParameterChild
          simulation={simulation}
          dimension={dimension}
          child={child}
          key={key}
          index={index}
          swr={swr}
        />
      )),
    []
  )

  /**
   * Render
   */
  return (
    <Card size="small" key={key} title={parameter?.label}>
      <Space direction="vertical">{components}</Space>
    </Card>
  )
}

/**
 * Parameters
 * @param props Props
 * @returns Parameters
 */
const Parameters = ({ simulation, swr }: IProps): JSX.Element => {
  // Data
  const subScheme = useMemo(
    () => simulation?.scheme.configuration.parameters,
    [simulation]
  )
  const dimension = useMemo(
    () => simulation?.scheme.configuration.dimension,
    [simulation]
  )

  // Initial
  useEffect(() => {
    if (!subScheme?.done) {
      _onDone(simulation, swr)
    }
  }, [simulation, subScheme, swr])

  // Build parameters
  const parameters = useMemo(
    () =>
      Object.keys(subScheme).map((key) => {
        if (key === 'index' || key === 'title' || key == 'done') return null
        const parameter = subScheme[key] as {
          label: string
          advanced?: boolean
          children: IModelParameter[]
        }

        if (parameter.advanced) return null

        return (
          <Parameter
            simulation={simulation}
            dimension={dimension}
            key={key}
            parameter={parameter}
            swr={swr}
          />
        )
      }),
    [subScheme]
  )

  const advanced = useMemo(
    () =>
      Object.keys(subScheme).map((key) => {
        if (key === 'index' || key === 'title' || key == 'done') return null
        const parameter = subScheme[key] as {
          label: string
          advanced?: boolean
          children: IModelParameter[]
        }

        if (!parameter.advanced) return null

        return (
          <Parameter
            simulation={simulation}
            dimension={dimension}
            key={key}
            parameter={parameter}
            swr={swr}
          />
        )
      }),
    [subScheme]
  )

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

export default Parameters
