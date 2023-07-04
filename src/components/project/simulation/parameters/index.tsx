/** @module Components.Project.Simulation.Parameters */

import { Dispatch, useCallback, useContext, useEffect, useMemo } from 'react'
import { Card, Checkbox, Collapse, Form, Layout, Select, Space } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'
import { IModelParameter, IUnit } from '@/models/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import Formula from '@/components/assets/formula'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
}

export interface IParameterProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  dimension: number | undefined
  pkey: string
  parameter: {
    label: string
    advanced?: boolean
    children: IModelParameter[]
  }
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
}

export interface IParameterChildProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  dimension: number | undefined
  child: any
  pkey: string
  index: number
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
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
  onValueChange: (value: string) => void,
  onUnitChange: (unit: IUnit) => void
): React.JSX.Element => (
  <Formula
    key={key}
    label={child.label2D ?? child.label}
    defaultValue={(child.value ?? child.default) as string}
    onValueChange={onValueChange}
    onUnitChange={onUnitChange}
    units={child.units}
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
): React.JSX.Element => (
  <Form layout="vertical" key={key}>
    <Form.Item label={child.label2D ?? child.label}>
      <Select
        options={child.options?.map((option) => ({
          label: option.label,
          value: option.value2D ?? option.value
        }))}
        defaultValue={
          (child.value ?? child.default2D ?? child.default) as string
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
): React.JSX.Element => (
  <Form layout="horizontal" key={key}>
    <Form.Item label={child.label2D ?? child.label}>
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
  onValueChange: (value: string) => void,
  onUnitChange: (unit: IUnit) => void
): React.JSX.Element => (
  <Formula
    key={key}
    label={child.label}
    defaultValue={(child.value ?? child.default) as string}
    units={child.units}
    unit={child.unit}
    onValueChange={onValueChange}
    onUnitChange={onUnitChange}
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
): React.JSX.Element => (
  <Form layout="vertical" key={key}>
    <Form.Item label={child.label}>
      <Select
        options={child.options}
        defaultValue={(child.value ?? child.default) as string}
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
): React.JSX.Element => (
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
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
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

    await swr.mutateOneSimulation(newSimulation)
  } catch (err: any) {
    dispatch(addError({ title: errors.update, err }))
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
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
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
      ...parameters
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

    await swr.mutateOneSimulation(newSimulation)
  } catch (err: any) {
    dispatch(addError({ title: errors.update, err }))
  }
}

/**
 * On unit change
 * @param simulation Simulation
 * @param key Key
 * @param index Index
 * @param unit Unit
 * @param swr SWR
 */
export const _onUnitChange = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  key: string,
  index: number,
  unit: IUnit,
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
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
    parameter.children[index].unit = unit

    // Diff
    const diff = {
      ...parameters
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
    await swr.mutateOneSimulation(newSimulation)
  } catch (err: any) {
    dispatch(addError({ title: errors.update, err }))
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
  pkey,
  index,
  swr
}: IParameterChildProps): React.JSX.Element | null => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On change
   * @param value Value
   */
  const onChange = useCallback(
    (value: string): void => {
      ;(async () => {
        await _onChange(simulation, pkey, index, value, swr, dispatch)
      })()
    },
    [simulation, pkey, index, swr, dispatch]
  )

  /**
   * On unit change
   * @param unit Unit
   */
  const onUnitChange = useCallback(
    (unit: IUnit): void => {
      ;(async () => {
        await _onUnitChange(simulation, pkey, index, unit, swr, dispatch)
      })()
    },
    [simulation, pkey, index, swr, dispatch]
  )

  /**
   * On change (event)
   * @param e Event
   */
  const onChangeEvent = useCallback(
    (e: CheckboxChangeEvent): void => {
      ;(async () => {
        await _onChange(
          simulation,
          pkey,
          index,
          e.target.checked,
          swr,
          dispatch
        )
      })()
    },
    [simulation, pkey, index, swr, dispatch]
  )

  /**
   * Render
   */
  if (dimension === 2) {
    if (child.only3D) return null
    else if (child.htmlEntity === 'formula')
      return _build2DFormula(pkey + '&' + index, child, onChange, onUnitChange)
    else if (child.htmlEntity === 'select')
      return _build2DSelect(pkey + '&' + index, child, onChange)
    else if (child.htmlEntity === 'checkbox')
      return _build2DCheckbox(pkey + '&' + index, child, onChangeEvent)

    return null
  } else {
    if (child.htmlEntity === 'formula')
      return _buildFormula(pkey + '&' + index, child, onChange, onUnitChange)
    else if (child.htmlEntity === 'select')
      return _buildSelect(pkey + '&' + index, child, onChange)
    else if (child.htmlEntity === 'checkbox')
      return _buildCheckbox(pkey + '&' + index, child, onChangeEvent)

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
  pkey,
  parameter,
  swr
}: IParameterProps): React.JSX.Element => {
  // Components
  const components = useMemo(
    () =>
      parameter.children.map((child, index) => (
        <ParameterChild
          key={pkey + '&' + child.label}
          simulation={simulation}
          dimension={dimension}
          child={child}
          pkey={pkey}
          index={index}
          swr={swr}
        />
      )),
    [simulation, dimension, pkey, parameter, swr]
  )

  /**
   * Render
   */
  return (
    <Card size="small" key={pkey} title={parameter?.label}>
      <Space direction="vertical">{components}</Space>
    </Card>
  )
}

/**
 * Parameters
 * @param props Props
 * @returns Parameters
 */
const Parameters = ({ simulation, swr }: IProps): React.JSX.Element => {
  // Context
  const { dispatch } = useContext(NotificationContext)

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
    ;(async () => {
      if (!subScheme?.done) await _onDone(simulation, swr, dispatch)
    })()
  }, [simulation, subScheme, swr, dispatch])

  // Build parameters
  const parameters = useMemo(
    () =>
      Object.keys(subScheme)
        .map((key) => {
          if (key === 'index' || key === 'title' || key == 'done') return null
          const parameter = subScheme[key] as {
            label: string
            advanced?: boolean
            children: IModelParameter[]
          }

          if (parameter.advanced) return null

          return (
            <Parameter
              key={key}
              simulation={simulation}
              dimension={dimension}
              pkey={key}
              parameter={parameter}
              swr={swr}
            />
          )
        })
        .filter((p) => p),
    [simulation, dimension, subScheme, swr]
  )

  const advanced = useMemo(
    () =>
      Object.keys(subScheme)
        .map((key) => {
          if (key === 'index' || key === 'title' || key == 'done') return null
          const parameter = subScheme[key] as {
            label: string
            advanced?: boolean
            children: IModelParameter[]
          }

          if (!parameter.advanced) return null

          return (
            <Parameter
              key={key}
              simulation={simulation}
              dimension={dimension}
              pkey={key}
              parameter={parameter}
              swr={swr}
            />
          )
        })
        .filter((p) => p),
    [simulation, dimension, subScheme, swr]
  )

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Space direction="vertical">
          {parameters}
          {advanced.length ? (
            <Collapse
              items={[
                {
                  key: 'advanced',
                  label: 'Advanced',
                  children: <Space direction="vertical">{advanced}</Space>
                }
              ]}
            />
          ) : null}
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Parameters
