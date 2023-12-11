/** @module Components.Project.Simulation.Parameters */

import { ReactNode, useCallback, useContext, useEffect, useMemo } from 'react'
import {
  Card,
  Checkbox,
  Collapse,
  Form,
  Layout,
  Radio,
  Select,
  Space
} from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'
import {
  IModelParameter,
  IModelParametersGroup,
  IModelVariable,
  IUnit
} from '@/models/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'
import Formula from '@/components/assets/formula'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'
import { RadioChangeEvent } from 'antd/lib'

/**
 * Props
 */
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface IProps {
  simulation: Simulation
  swr: Swr
}

export interface IParameterProps {
  simulation: Simulation
  dimension: number | undefined
  pkey: string
  parameter: IModelParametersGroup
  swr: Swr
}

export interface IParameterChild2D3DProps {
  variables: IModelVariable[] | undefined
  child: IModelParameter
  pkey: string
  index: number
  onChange: (value: string) => void
  onChangeEvent: (e: CheckboxChangeEvent) => void
  onUnitChange: (unit: IUnit) => void
}

export interface IParameterChildProps {
  simulation: Simulation
  dimension: number | undefined
  child: IModelParameter
  pkey: string
  index: number
  swr: Swr
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
  variables: IModelVariable[] | undefined,
  child: IModelParameter,
  onValueChange: (value: string) => void,
  onUnitChange: (unit: IUnit) => void
): ReactNode => (
  <Formula
    key={key}
    dimension={2}
    label={child.label2D ?? child.label}
    defaultValue={(child.value ?? child.default) as string}
    additionalKeywords={variables}
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
): ReactNode => (
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
): ReactNode => (
  <Form layout="horizontal" key={key}>
    <Form.Item label={child.label2D ?? child.label}>
      <Checkbox
        defaultChecked={(child.value as boolean) ?? child.default}
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
  variables: IModelVariable[] | undefined,
  child: IModelParameter,
  onValueChange: (value: string) => void,
  onUnitChange: (unit: IUnit) => void
): ReactNode => (
  <Formula
    key={key}
    dimension={3}
    label={child.label}
    defaultValue={(child.value ?? child.default) as string}
    additionalKeywords={variables}
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
): ReactNode => (
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
): ReactNode => (
  <Form layout="horizontal" key={key}>
    <Form.Item label={child.label}>
      <Checkbox
        defaultChecked={(child.value as boolean) ?? child.default}
        onChange={onValueChange}
      />
    </Form.Item>
  </Form>
)

/**
 * Build radio
 * @param key Key
 * @param child Child
 * @param onValueChange On value change
 * @returns Radio
 */
export const _buildRadio = (
  key: string,
  child: IModelParameter,
  onValueChange: (e: RadioChangeEvent) => void
): ReactNode => {
  return (
    <Form layout="vertical" key={key}>
      <Form.Item label={child.label}>
        <Radio.Group
          options={child.options}
          defaultValue={child.value ?? child.default}
          onChange={onValueChange}
        ></Radio.Group>
      </Form.Item>
    </Form>
  )
}

/**
 * On done
 * @param simulation Simulation
 * @param swr SWR
 */
export const _onDone = async (
  simulation: Simulation,
  swr: Swr
): Promise<void> => {
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
  simulation: Simulation,
  key: string,
  index: number,
  value: boolean | string,
  swr: Swr
): Promise<void> => {
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
  simulation: Simulation,
  key: string,
  index: number,
  unit: IUnit,
  swr: Swr
): Promise<void> => {
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
}

/**
 * Parameter child 2D
 * @param props Props
 * @returns ParameterChild2D
 */
const ParameterChild2D: React.FunctionComponent<IParameterChild2D3DProps> = ({
  variables,
  child,
  pkey,
  index,
  onChange,
  onChangeEvent,
  onUnitChange
}) => {
  if (child.only3D) return null
  else if (child.htmlEntity === 'formula')
    return _build2DFormula(
      pkey + '&' + index,
      variables,
      child,
      onChange,
      onUnitChange
    )
  else if (child.htmlEntity === 'select')
    return _build2DSelect(pkey + '&' + index, child, onChange)
  else if (child.htmlEntity === 'checkbox')
    return _build2DCheckbox(pkey + '&' + index, child, onChangeEvent)

  return null
}

/**
 * Parameter child 3D
 * @param props Props
 * @returns ParameterChild3D
 */
const ParameterChild3D: React.FunctionComponent<IParameterChild2D3DProps> = ({
  variables,
  child,
  pkey,
  index,
  onChange,
  onChangeEvent,
  onUnitChange
}) => {
  if (child.htmlEntity === 'formula')
    return _buildFormula(
      pkey + '&' + index,
      variables,
      child,
      onChange,
      onUnitChange
    )
  else if (child.htmlEntity === 'select')
    return _buildSelect(pkey + '&' + index, child, onChange)
  else if (child.htmlEntity === 'checkbox')
    return _buildCheckbox(pkey + '&' + index, child, onChangeEvent)
  else if (child.htmlEntity === 'radio')
    return _buildRadio(pkey + '&' + index, child, onChangeEvent)

  return null
}

/**
 * ParameterChild
 * @param props Props
 * @returns ParameterChild
 */
const ParameterChild: React.FunctionComponent<IParameterChildProps> = ({
  simulation,
  dimension,
  child,
  pkey,
  index,
  swr
}) => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const variables = useMemo(() => simulation.scheme.variables, [simulation])

  /**
   * On change
   * @param value Value
   */
  const onChange = useCallback(
    (value: string): void => {
      asyncFunctionExec(async () => {
        try {
          await _onChange(simulation, pkey, index, value, swr)
        } catch (err: any) {
          dispatch(addError({ title: errors.update, err }))
        }
      })
    },
    [simulation, pkey, index, swr, dispatch]
  )

  /**
   * On unit change
   * @param unit Unit
   */
  const onUnitChange = useCallback(
    (unit: IUnit): void => {
      asyncFunctionExec(async () => {
        try {
          await _onUnitChange(simulation, pkey, index, unit, swr)
        } catch (err: any) {
          dispatch(addError({ title: errors.update, err }))
        }
      })
    },
    [simulation, pkey, index, swr, dispatch]
  )

  /**
   * On change (event)
   * @param e Event
   */
  const onChangeEvent = useCallback(
    (e: CheckboxChangeEvent): void => {
      asyncFunctionExec(async () => {
        try {
          await _onChange(simulation, pkey, index, e.target.checked, swr)
        } catch (err: any) {
          dispatch(addError({ title: errors.update, err }))
        }
      })
    },
    [simulation, pkey, index, swr, dispatch]
  )

  /**
   * Render
   */
  if (dimension === 2)
    return (
      <ParameterChild2D
        variables={variables}
        child={child}
        pkey={pkey}
        index={index}
        onChange={onChange}
        onChangeEvent={onChangeEvent}
        onUnitChange={onUnitChange}
      />
    )
  return (
    <ParameterChild3D
      variables={variables}
      child={child}
      pkey={pkey}
      index={index}
      onChange={onChange}
      onChangeEvent={onChangeEvent}
      onUnitChange={onUnitChange}
    />
  )
}

/**
 * Parameter
 * @param props Props
 * @returns Parameter
 */
const Parameter: React.FunctionComponent<IParameterProps> = ({
  simulation,
  dimension,
  pkey,
  parameter,
  swr
}) => {
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
const Parameters: React.FunctionComponent<IProps> = ({ simulation, swr }) => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  // Sub scheme
  const subScheme = useMemo(
    () => simulation?.scheme.configuration.parameters,
    [simulation]
  )

  // Dimension
  const dimension = useMemo(
    () => simulation?.scheme.configuration.dimension,
    [simulation]
  )

  // Initial
  useEffect(() => {
    asyncFunctionExec(async () => {
      try {
        if (!subScheme?.done) await _onDone(simulation, swr)
      } catch (err: any) {
        dispatch(addError({ title: errors.update, err }))
      }
    })
  }, [simulation, subScheme, swr, dispatch])

  // Parameters
  const parameters = useMemo(
    () =>
      Object.keys(subScheme)
        .map((key) => {
          if (key === 'index' || key === 'title' || key === 'done') return null
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

  // Advanced parameters
  const advanced = useMemo(
    () =>
      Object.keys(subScheme)
        .map((key) => {
          if (key === 'index' || key === 'title' || key === 'done') return null
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
