/** @module Components.Project.Simulation.BoundaryConditions.List */

import { useCallback, useContext, useMemo, useRef } from 'react'
import { Card, Typography } from 'antd'
import { WarningOutlined } from '@ant-design/icons'

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
import {
  enable,
  disable,
  select,
  setPart,
  setType
} from '@/context/select/actions'

import { EditButton } from '@/components/assets/button'

import Delete from '../delete'

import globalStyle from '@/styles/index.module.css'
import style from '../../index.module.css'

/**
 * Props
 */
export type Geometry = Pick<IFrontGeometriesItem, 'id' | 'summary'>
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface Props {
  geometries: Geometry[]
  simulation: Simulation
  swr: Swr
  onEdit: (type: string, index: number) => void
}

export interface ListItemProps {
  geometries: Geometry[]
  simulation: Simulation
  boundaryCondition: IModelBoundaryConditionValue
  index: number
  type: string
  swr: Swr
  _onEdit: (type: string, index: number) => void
}

/**
 * ListItem
 * @param props Props
 * @returns ListItem
 */
const ListItem: React.FunctionComponent<ListItemProps> = ({
  geometries,
  simulation,
  boundaryCondition,
  index,
  type,
  swr,
  _onEdit
}) => {
  // Ref
  const disableDispatch = useRef<boolean>(false)

  // Context
  const { dispatch } = useContext(SelectContext)

  // Geometry
  const geometry = useMemo(
    () =>
      geometries.find((geometry) => geometry.id === boundaryCondition.geometry),
    [geometries, boundaryCondition]
  )

  // Selected
  const selected = useMemo(
    () => boundaryCondition.selected,
    [boundaryCondition.selected]
  )

  // Type
  const selectionType = useMemo(
    () => (geometry?.summary.dimension === 2 ? 'edges' : 'faces'),
    [geometry]
  )

  /**
   * Highlight current
   * @param key Key
   * @param index Index
   */
  const highlight = useCallback((): void => {
    // Distpatch
    dispatch(enable())
    dispatch(setType(selectionType))
    dispatch(setPart(geometry?.summary.uuid))
    dispatch(select(selected))
  }, [geometry, selected, selectionType, dispatch])

  /**
   * Unhighlight current
   */
  const unhighlight = useCallback((): void => {
    if (disableDispatch.current) return
    dispatch(disable())
  }, [dispatch])

  /**
   * On edit
   */
  const onEdit = useCallback((): void => {
    disableDispatch.current = true
    _onEdit(type, index)
    setTimeout(() => (disableDispatch.current = false), 1_000)
  }, [index, type, _onEdit])

  return (
    <Card
      className={`${globalStyle.textAlignCenter} ${style.listItem}`}
      hoverable
      onMouseMove={highlight}
      onMouseLeave={unhighlight}
      actions={[
        <EditButton key="edit" onEdit={onEdit} />,
        <Delete
          key="delete"
          simulation={simulation}
          type={type}
          index={index}
          swr={swr}
        />
      ]}
    >
      {geometry ? null : (
        <>
          <Typography.Text type="danger" strong>
            <WarningOutlined /> Geometry not found
          </Typography.Text>
          <br />
        </>
      )}
      <Typography.Text strong className={globalStyle.textAlignCenter}>
        {boundaryCondition.name}
      </Typography.Text>{' '}
      <Typography.Text>({boundaryCondition.type.label})</Typography.Text>
    </Card>
  )
}

/**
 * List
 * @param props Props
 * @returns List
 */
const List: React.FunctionComponent<Props> = ({
  geometries,
  simulation,
  swr,
  onEdit
}) => {
  // Boundary conditions
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
