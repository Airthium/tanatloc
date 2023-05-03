/** @module Components.Project.Simulation.Run.Sensors.List */

import { useCallback, useContext, useMemo } from 'react'
import { Card, Typography } from 'antd'

import { IModelSensor } from '@/models/index.d'
import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'

import { SelectContext } from '@/context/select'
import { disable, enable, setPoint } from '@/context/select/actions'

import { EditButton } from '@/components/assets/button'

import Delete from '../delete'

import globalStyle from '@/styles/index.module.css'
import style from '../../../index.module.css'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  onEdit: (sensor: IModelSensor & { index: number }) => void
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
}

export interface IListItemProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  sensor: IModelSensor
  index: number
  _onEdit: (sensor: IModelSensor & { index: number }) => void
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
}

/**
 * ListItem
 * @param props Props
 * @returns ListItem
 */
const ListItem = ({
  simulation,
  sensor,
  index,
  _onEdit,
  swr
}: IListItemProps): JSX.Element => {
  // Data
  const { dispatch } = useContext(SelectContext)

  /**
   * Highlight
   * @param sensor Sensor
   */
  const highlight = useCallback(() => {
    dispatch(enable())
    dispatch(setPoint(sensor.point))
  }, [sensor, dispatch])

  /**
   * Unhighlight
   */
  const unhighlight = useCallback(() => {
    dispatch(disable())
  }, [dispatch])

  /**
   * On edit
   */
  const onEdit = useCallback(
    () => _onEdit({ ...sensor, index }),
    [sensor, index, _onEdit]
  )

  /**
   * Render
   */
  return (
    <Card
      className={`${globalStyle.textAlignCenter} ${style.listItem}`}
      hoverable
      onMouseEnter={highlight}
      onMouseLeave={unhighlight}
      actions={[
        <EditButton key="edit" onEdit={onEdit} />,
        <Delete key="delete" simulation={simulation} index={index} swr={swr} />
      ]}
    >
      <Typography.Text strong className={globalStyle.textAlignCenter}>
        {sensor.name}
      </Typography.Text>
    </Card>
  )
}

/**
 * List
 * @param props Props
 * @returns List
 */
const List = ({ simulation, onEdit, swr }: IProps): JSX.Element => {
  // Data
  const run = useMemo(() => simulation.scheme.configuration.run, [simulation])

  /**
   * Render
   */
  return (
    <>
      {run.sensors?.map((sensor, index) => (
        <ListItem
          key={sensor.name}
          simulation={simulation}
          sensor={sensor}
          index={index}
          _onEdit={onEdit}
          swr={swr}
        />
      ))}
    </>
  )
}

export default List
