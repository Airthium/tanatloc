import { useCallback, useContext } from 'react'
import { Card, Typography } from 'antd'

import { IModelSensor } from '@/models/index.d'
import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'

import { SelectContext } from '@/context/select'
import { disable, enable, setPoint } from '@/context/select/actions'
import Delete from '../delete'
import { EditButton } from '@/components/assets/button'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  onEdit: (sensor: IModelSensor & { index: number }) => void
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

const List = ({ simulation, onEdit, swr }: IProps): JSX.Element => {
  // Data
  const run = simulation.scheme.configuration.run
  const { dispatch } = useContext(SelectContext)

  /**
   * Highlight
   * @param sensor Sensor
   */
  const highlight = useCallback(
    (sensor: IModelSensor) => {
      dispatch(enable())
      dispatch(setPoint(sensor.point))
    },
    [dispatch]
  )

  /**
   * Unhighlight
   */
  const unhighlight = useCallback(() => {
    dispatch(setPoint())
    dispatch(disable())
  }, [dispatch])

  /**
   * Render
   */
  return (
    <>
      {run.sensors?.map((sensor, index) => (
        <Card
          className="sensor-item text-center"
          key={index}
          hoverable
          onMouseEnter={() => highlight(sensor)}
          onMouseLeave={unhighlight}
          actions={[
            <EditButton
              key="edit"
              onEdit={() => {
                onEdit({ ...sensor, index })
              }}
            />,
            <Delete
              key="delete"
              simulation={simulation}
              index={index}
              swr={swr}
            />
          ]}
        >
          <Typography.Text strong className="text-center">
            {sensor.name}
          </Typography.Text>
        </Card>
      ))}
    </>
  )
}

export default List
