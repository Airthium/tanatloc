import { useCallback, useContext, useEffect, useState } from 'react'
import { Button, Card, Drawer, Space, Tooltip, Typography } from 'antd'
import { CloseOutlined, PushpinOutlined } from '@ant-design/icons'

import { IModelSensor } from '@/models/index.d'

import { SelectContext } from '@/context/select'
import { disable, enable, setPoint, setType } from '@/context/select/actions'

import Formula from '@/components/assets/formula'
import { AddButton, CancelButton, EditButton } from '@/components/assets/button'
import { Vector3 } from 'three'

export interface IProps {
  visible?: boolean
  sensor?: {}
  onClose: () => void
}

const Sensor = ({ visible, sensor, onClose }: IProps): JSX.Element => {
  const [current, setCurrent] = useState<IModelSensor>()
  const [selectionEnabled, setSelectionEnabled] = useState<boolean>()

  const { point, dispatch } = useContext(SelectContext)

  const stopSelection = useCallback(() => {
    console.log('stop selection')
    setSelectionEnabled(false)
    dispatch(disable())
    window.removeEventListener('click', stopSelection)
  }, [dispatch])

  // Set point type
  useEffect(() => {
    dispatch(setType('point'))
  }, [dispatch])

  const startSelection = useCallback(() => {
    if (selectionEnabled) {
      stopSelection()
    } else {
      setSelectionEnabled(true)
      dispatch(enable())
      setTimeout(() => window.addEventListener('click', stopSelection), 500)
    }
  }, [selectionEnabled, stopSelection, dispatch])

  const onPosition = (x: number, y: number, z: number): void => {
    dispatch(setPoint(new Vector3(x, y, z)))
  }

  const onFormula = (formula: string) => {
    setCurrent((prev) => ({
      ...prev,
      formula
    }))
  }

  const close = useCallback(() => {
    setCurrent(undefined)
    dispatch(setPoint())
    onClose()
  }, [dispatch, onClose])

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
            <EditButton needMargin onEdit={console.log}>
              Edit
            </EditButton>
          ) : (
            <AddButton needMargin onAdd={console.log}>
              Add
            </AddButton>
          )}
        </div>
      }
    >
      <Space direction="vertical" className="full-width">
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
          <Formula label="Formula" onValueChange={onFormula} />
        </Card>
      </Space>
    </Drawer>
  )
}

export default Sensor
