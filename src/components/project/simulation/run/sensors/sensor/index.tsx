/** @module Components.Project.Simulation.Run.Sensor */

import { ChangeEvent, useCallback, useContext, useState } from 'react'
import {
  Button,
  Card,
  Drawer,
  Input,
  Space,
  Tabs,
  Tooltip,
  Typography
} from 'antd'
import {
  CloseOutlined,
  ExclamationCircleOutlined,
  PushpinOutlined
} from '@ant-design/icons'

import { IModelSensor } from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontGeometriesItem
} from '@/api/index.d'

import { SelectContext } from '@/context/select'
import {
  disable,
  enable,
  setPart,
  setPoint,
  setType
} from '@/context/select/actions'

import useCustomEffect from '@/components/utils/useCustomEffect'

import Formula from '@/components/assets/formula'
import { CancelButton } from '@/components/assets/button'

import Edit from '../edit'
import Add from '../add'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  visible?: boolean
  geometries: Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>[]
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  sensor?: IModelSensor & { index: number }
  onClose: () => void
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
}

/**
 * Sensor
 * @param props Props
 * @returns Sensor
 */
const Sensor = ({
  visible,
  geometries,
  simulation,
  sensor,
  onClose,
  swr
}: IProps): JSX.Element => {
  // State
  const [selectionEnabled, setSelectionEnabled] = useState<boolean>()
  const [current, setCurrent] = useState<IModelSensor>()
  const [activeKey, setActiveKey] = useState<string>()
  const [error, setError] = useState<string>()

  // Data
  const { point, dispatch } = useContext(SelectContext)

  // Init
  useCustomEffect(
    () => {
      dispatch(setPart(geometries[0]?.summary.uuid))
      setActiveKey(sensor?.geometry)
    },
    [geometries, sensor],
    [dispatch]
  )

  // Set point type
  useCustomEffect(() => {
    dispatch(setType('point'))
  }, [dispatch])

  // Default name
  useCustomEffect(() => {
    if (!sensor) {
      const run = simulation.scheme.configuration.run
      setCurrent((prev) => ({
        ...(prev as IModelSensor),
        name: 'Sensor ' + (run.sensors ? run.sensors.length + 1 : 1)
      }))
    }
  }, [simulation, sensor])

  // Edit
  useCustomEffect(
    () => {
      if (sensor) {
        setCurrent(sensor)
        dispatch(
          setPoint({ x: sensor.point.x, y: sensor.point.y, z: sensor.point.z })
        )
      }
    },
    [sensor],
    [dispatch]
  )

  // Point
  useCustomEffect(() => {
    if (point)
      setCurrent((prev) => ({
        ...(prev as IModelSensor),
        point
      }))
  }, [point])

  /**
   * Stop selection
   */
  const stopSelection = useCallback(() => {
    setSelectionEnabled(false)
    dispatch(disable())
    window.removeEventListener('click', stopSelection)
  }, [dispatch])

  /**
   * Start selection
   */
  const startSelection = useCallback((): void => {
    if (selectionEnabled) {
      stopSelection()
    } else {
      setSelectionEnabled(true)
      dispatch(enable())
      setTimeout(() => window.addEventListener('click', stopSelection), 50)
    }
  }, [selectionEnabled, stopSelection, dispatch])

  /**
   * On geometry change
   * @param key Key
   */
  const onGeometryChange = useCallback(
    (key: string): void => {
      // Active key
      setActiveKey(key)

      // Set part
      const geometry = geometries.find((geometry) => geometry.id === key)
      dispatch(setPart(geometry!.summary.uuid))

      // Set geometry
      setCurrent((prevCurrent) => ({
        ...(prevCurrent as IModelSensor),
        geometry: key
      }))
    },
    [geometries, dispatch]
  )

  /**
   * On position
   * @param x Point X
   * @param y Point Y
   * @param z Point Z
   */
  const onPosition = useCallback(
    (x: number, y: number, z: number): void => {
      dispatch(setPoint({ x, y, z }))
    },
    [dispatch]
  )

  /**
   * On formula
   * @param formula Formula
   */
  const onFormula = useCallback((newFormula: string): void => {
    setCurrent((prev) => ({
      ...(prev as IModelSensor),
      formula: newFormula
    }))
  }, [])

  /**
   * Close
   */
  const close = useCallback((): void => {
    setCurrent(undefined)
    setError(undefined)
    dispatch(setPoint())
    dispatch(disable())
    onClose()
  }, [dispatch, onClose])

  /**
   * On change
   * @param e Event
   */
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    setCurrent((prev) => ({
      ...(prev as IModelSensor),
      name: e.target.value
    }))
  }, [])

  /**
   * On position x
   * @param value Value
   */
  const onPositionX = useCallback(
    (value: string): void => onPosition(+value, point?.y ?? 0, point?.z ?? 0),
    [point, onPosition]
  )

  /**
   * On position y
   * @param value Value
   */
  const onPositionY = useCallback(
    (value: string): void => onPosition(point?.x ?? 0, +value, point?.z ?? 0),
    [point, onPosition]
  )

  /**
   * On position z
   * @param value Value
   */
  const onPositionZ = useCallback(
    (value: string): void => onPosition(point?.x ?? 0, point?.y ?? 0, +value),
    [point, onPosition]
  )

  /**
   * Render
   */
  return (
    <Drawer
      title="Sensor"
      placement="left"
      closable={false}
      open={visible}
      mask={false}
      maskClosable={false}
      width={300}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={close} />}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CancelButton onCancel={close} />
          {sensor ? (
            <Edit
              simulation={simulation}
              sensor={{
                ...sensor,
                ...current
              }}
              onError={setError}
              onClose={close}
              swr={swr}
            />
          ) : (
            <Add
              simulation={simulation}
              sensor={current!}
              onError={setError}
              onClose={close}
              swr={swr}
            />
          )}
        </div>
      }
    >
      <Space direction="vertical" className={globalStyle.fullWidth}>
        <Card size="small">
          <Typography.Text>Name</Typography.Text>
          <Input value={current?.name} onChange={onChange} />
        </Card>
        <Card size="small">
          <Tabs
            items={geometries.map((geometry) => ({
              key: geometry.id,
              label: geometry.name
            }))}
            activeKey={activeKey}
            onChange={onGeometryChange}
          />
          <Space direction="vertical" className={globalStyle.fullWidth}>
            <Space
              className={globalStyle.fullWidth}
              style={{ justifyContent: 'space-between' }}
            >
              <Typography.Text>Point selection</Typography.Text>
              <Tooltip title="Pin in the geometry">
                <Button
                  size="small"
                  type={selectionEnabled ? 'primary' : 'default'}
                  icon={<PushpinOutlined />}
                  onClick={startSelection}
                />
              </Tooltip>
            </Space>
            <Formula
              label="X"
              defaultValue={current?.point?.x}
              onValueChange={onPositionX}
            />
            <Formula
              label="Y"
              defaultValue={current?.point?.y}
              onValueChange={onPositionY}
            />
            <Formula
              label="Z"
              defaultValue={current?.point?.z}
              onValueChange={onPositionZ}
            />
          </Space>
        </Card>
        <Card size="small" className={globalStyle.noBorderBottom}>
          <Formula
            label="Formula"
            defaultValue={current?.formula}
            onValueChange={onFormula}
          />
        </Card>

        {error && (
          <Typography.Text>
            <ExclamationCircleOutlined style={{ color: 'red' }} /> {error}
          </Typography.Text>
        )}
      </Space>
    </Drawer>
  )
}

export default Sensor
