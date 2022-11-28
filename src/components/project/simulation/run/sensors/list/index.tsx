/** @module Components.Project.Simulation.Run.Sensors.List */

import { useCallback, useContext, useState } from 'react'
import { Card, Typography } from 'antd'
import { css } from '@emotion/react'

import { IModelSensor } from '@/models/index.d'
import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'

import { SelectContext } from '@/context/select'
import { disable, enable, setPoint } from '@/context/select/actions'

import { EditButton } from '@/components/assets/button'

import { globalStyle } from '@/styles'
import style from '../../../index.style'

import Delete from '../delete'

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
  // State
  const [enabled, setEnabled] = useState<boolean>(true)

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
    enabled && dispatch(setPoint())
    dispatch(disable())
  }, [enabled, dispatch])

  /**
   * Render
   */
  return (
    <>
      {run.sensors?.map((sensor, index) => (
        <Card
          css={css([globalStyle.textAlignCenter, style.listItem])}
          key={index}
          hoverable
          onMouseEnter={() => highlight(sensor)}
          onMouseLeave={unhighlight}
          actions={[
            <EditButton
              key="edit"
              onEdit={() => {
                setEnabled(false)
                onEdit({ ...sensor, index })
                setTimeout(() => setEnabled(true), 500)
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
          <Typography.Text strong css={globalStyle.textAlignCenter}>
            {sensor.name}
          </Typography.Text>
        </Card>
      ))}
    </>
  )
}

export default List
