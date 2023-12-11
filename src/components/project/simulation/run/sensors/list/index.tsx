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
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface IProps {
  simulation: Simulation
  onEdit: (sensor: IModelSensor & { index: number }) => void
  swr: Swr
}

export interface IListItemProps {
  simulation: Simulation
  sensor: IModelSensor
  index: number
  _onEdit: (sensor: IModelSensor & { index: number }) => void
  swr: Swr
}

/**
 * ListItem
 * @param props Props
 * @returns ListItem
 */
const ListItem: React.FunctionComponent<IListItemProps> = ({
  simulation,
  sensor,
  index,
  _onEdit,
  swr
}) => {
  // Data
  const { dispatch } = useContext(SelectContext)

  /**
   * Highlight
   * @param sensor Sensor
   */
  const highlight = useCallback((): void => {
    dispatch(enable())
    dispatch(setPoint(sensor.point))
  }, [sensor, dispatch])

  /**
   * Unhighlight
   */
  const unhighlight = useCallback((): void => {
    dispatch(disable())
    dispatch(setPoint())
  }, [dispatch])

  /**
   * On edit
   */
  const onEdit = useCallback(
    (): void => _onEdit({ ...sensor, index }),
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
const List: React.FunctionComponent<IProps> = ({ simulation, onEdit, swr }) => {
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
