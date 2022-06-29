/** @module Components.Simulation.Project.Run.Sensor */

import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Card, Drawer, Input, Space, Tooltip, Typography } from 'antd'
import {
  CloseOutlined,
  ExclamationCircleOutlined,
  PushpinOutlined
} from '@ant-design/icons'

import { IModelSensor } from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { SelectContext } from '@/context/select'
import { disable, enable, setPoint, setType } from '@/context/select/actions'

import Formula from '@/components/assets/formula'
import { AddButton, CancelButton, EditButton } from '@/components/assets/button'

import SimulationAPI from '@/api/simulation'

import Utils from '@/lib/utils'
import { ErrorNotification } from '@/components/assets/notification'

/**
 * Props
 */
export interface IProps {
  visible?: boolean
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  sensor?: IModelSensor
  onClose: () => void
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

/**
 * Errors
 */
const errors = {
  update: 'Unable to update the simulation',
  name: 'You need to define a name',
  point: 'You need to define a point',
  formula: 'You need to define a formula'
}

/**
 * On add
 * @param simulation Simulation
 * @param sensor Sensor
 * @param swr SWR
 */
export const onAdd = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  sensor: IModelSensor,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
) => {
  try {
    const newSimulation = Utils.deepCopy(simulation)

    // Update local
    const run = newSimulation.scheme.configuration.run

    // Diff
    const diff = {
      ...run,
      sensors: [...(run.sensors || []), sensor]
    }

    // API
    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'run'],
        value: diff
      }
    ])

    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
  }
}

/**
 * Sensor
 * @param props Props
 * @returns Sensor
 */
const Sensor = ({
  visible,
  simulation,
  sensor,
  onClose,
  swr
}: IProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>()
  const [selectionEnabled, setSelectionEnabled] = useState<boolean>()
  const [name, setName] = useState<string>()
  const [formula, setFormula] = useState<string>()
  const [error, setError] = useState<string>()

  const { point, dispatch } = useContext(SelectContext)

  // Set point type
  useEffect(() => {
    dispatch(setType('point'))
  }, [dispatch])

  // Default name
  useEffect(() => {
    if (!sensor) {
      const run = simulation.scheme.configuration.run
      setName('Sensor ' + (run.sensors ? run.sensors.length + 1 : 1))
    }
  }, [simulation, sensor])

  // Edit
  useEffect(() => {
    if (sensor) {
      dispatch(
        setPoint({ x: sensor.point.x, y: sensor.point.y, z: sensor.point.z })
      )
      setFormula(sensor.formula)
    }
  }, [sensor, dispatch])

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
  const startSelection = useCallback(() => {
    if (selectionEnabled) {
      stopSelection()
    } else {
      setSelectionEnabled(true)
      dispatch(enable())
      setTimeout(() => window.addEventListener('click', stopSelection), 500)
    }
  }, [selectionEnabled, stopSelection, dispatch])

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
  const onFormula = useCallback((newFormula: string) => {
    setFormula(newFormula)
  }, [])

  /**
   * Close
   */
  const close = useCallback(() => {
    setFormula(undefined)
    dispatch(setPoint())
    onClose()
  }, [dispatch, onClose])

  /**
   * On edit
   */
  const onEdit = useCallback(() => {
    if (!point || !formula) return

    const newSensor = {
      point: {
        x: point.x,
        y: point.y,
        z: point.z
      },
      formula
    }

    // console.log(newSensor)

    close()
  }, [point, formula, close])

  /**
   * Render
   */
  return (
    <Drawer
      className="sensor"
      title="Sensor"
      placement="left"
      closable={false}
      visible={visible}
      mask={false}
      maskClosable={false}
      width={300}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={close} />}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CancelButton onCancel={close} />
          {sensor ? (
            <EditButton needMargin onEdit={onEdit}>
              Edit
            </EditButton>
          ) : (
            <AddButton
              loading={loading}
              needMargin
              onAdd={async () => {
                setLoading(true)
                try {
                  // Check
                  if (!name) {
                    setError(errors.name)
                    setLoading(false)
                    return
                  }

                  if (!point) {
                    setError(errors.point)
                    setLoading(false)
                    return
                  }

                  if (!formula) {
                    setError(errors.formula)
                    setLoading(false)
                    return
                  }

                  setError(undefined)

                  await onAdd(simulation, { name, point, formula }, swr)

                  setLoading(false)
                  onClose()
                } catch (err) {
                  setLoading(false)
                }
              }}
            >
              Add
            </AddButton>
          )}
        </div>
      }
    >
      <Space direction="vertical" className="full-width">
        <Card size="small">
          <Typography.Text>Name</Typography.Text>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Card>
        <Card size="small">
          <Space direction="vertical" className="full-width">
            <Space
              className="full-width"
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
              defaultValue={point?.x}
              onValueChange={(value) =>
                onPosition(+value, point?.y ?? 0, point?.z ?? 0)
              }
            />
            <Formula
              label="Y"
              defaultValue={point?.y}
              onValueChange={(value) =>
                onPosition(point?.x ?? 0, +value, point?.z ?? 0)
              }
            />
            <Formula
              label="Z"
              defaultValue={point?.z}
              onValueChange={(value) =>
                onPosition(point?.x ?? 0, point?.y ?? 0, +value)
              }
            />
          </Space>
        </Card>
        <Card size="small" className="no-border-bottom">
          <Formula
            label="Formula"
            defaultValue={formula}
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
