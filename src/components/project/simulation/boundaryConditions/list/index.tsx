/** @module Components.Project.Simulation.BoundaryConditions.List */

import { useCallback, useContext, useMemo, useState } from 'react'
import { Card, Typography } from 'antd'

import {
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition
} from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontGeometriesItem
} from '@/api/index.d'

import { SelectContext } from '@/context/select'
import { enable, disable, select, setPart } from '@/context/select/actions'

import { EditButton } from '@/components/assets/button'

import Delete from '../delete'

import style from '../../index.module.css'

/**
 * Props
 */
export interface IProps {
  geometries: Pick<IFrontGeometriesItem, 'id' | 'summary'>[]
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
  onEdit: (type: string, index: number) => void
}

export interface IListItemProps {
  geometries: Pick<IFrontGeometriesItem, 'id' | 'summary'>[]
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  boundaryCondition: IModelBoundaryConditionValue
  index: number
  type: string
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
  _onEdit: (type: string, index: number) => void
}

/**
 * ListItem
 * @param props Props
 * @returns ListItem
 */
const ListItem = ({
  geometries,
  simulation,
  boundaryCondition,
  index,
  type,
  swr,
  _onEdit
}: IListItemProps): React.JSX.Element => {
  // State
  const [enabled, setEnabled] = useState<boolean>(true)

  // Context
  const { dispatch } = useContext(SelectContext)

  /**
   * Highlight current
   * @param key Key
   * @param index Index
   */
  const highlight = useCallback((): void => {
    dispatch(enable())

    // Geometry
    const geometryId = boundaryCondition.geometry
    const geometry = geometries.find((geometry) => geometry.id === geometryId)
    dispatch(setPart(geometry?.summary.uuid))

    // Selected
    const currentSelected = boundaryCondition.selected
    dispatch(select(currentSelected))
  }, [geometries, boundaryCondition, dispatch])

  /**
   * Unhighlight current
   */
  const unhighlight = useCallback((): void => {
    enabled && dispatch(disable())
  }, [enabled, dispatch])

  /**
   * On edit
   */
  const onEdit = useCallback((): void => {
    setEnabled(false)
    _onEdit(type, index)
    setTimeout(() => setEnabled(true), 500)
  }, [index, type, _onEdit])

  return (
    <Card
      className={style.listItem}
      hoverable
      onMouseEnter={highlight}
      onMouseLeave={unhighlight}
      actions={[
        <EditButton key="edit" onEdit={onEdit} />,
        <Delete
          key="delete"
          simulation={{
            id: simulation.id,
            scheme: simulation.scheme
          }}
          type={type}
          index={index}
          swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
        />
      ]}
    >
      <Typography.Text strong>{boundaryCondition.name}</Typography.Text>{' '}
      <Typography.Text>({boundaryCondition.type.label})</Typography.Text>
    </Card>
  )
}

/**
 * List
 * @param props Props
 * @returns List
 */
const List = ({
  geometries,
  simulation,
  swr,
  onEdit
}: IProps): React.JSX.Element => {
  // Data
  const boundaryConditions = useMemo(
    () => simulation.scheme.configuration.boundaryConditions,
    [simulation]
  )

  /**
   * Render
   */
  return (
    <>
      {Object.keys(boundaryConditions)
        .map((type) => {
          if (type === 'index' || type === 'title' || type === 'done') return

          const typedBoundaryCondition = boundaryConditions[
            type
          ] as IModelTypedBoundaryCondition

          return typedBoundaryCondition.values?.map((child, index: number) => {
            return (
              <ListItem
                key={child.uuid}
                geometries={geometries}
                simulation={simulation}
                boundaryCondition={child}
                index={index}
                type={type}
                swr={swr}
                _onEdit={onEdit}
              />
            )
          })
        })
        .filter((l) => l)}
    </>
  )
}

export default List
