/** @module Components.Project.Simulation.Materials.List */

import { useCallback, useContext, useMemo } from 'react'
import { Card, Typography } from 'antd'
import { WarningOutlined } from '@ant-design/icons'

import { IModelMaterialsValue } from '@/models/index.d'
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
  onEdit: (index: number) => void
}

export interface ListItemProps {
  geometries: Geometry[]
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  material: IModelMaterialsValue
  index: number
  swr: Swr
  _onEdit: (index: number) => void
}

/**
 * List item
 * @param props Props
 * @returns ListItem
 */
const ListItem: React.FunctionComponent<ListItemProps> = ({
  geometries,
  simulation,
  material,
  index,
  swr,
  _onEdit
}) => {
  // Context
  const { dispatch } = useContext(SelectContext)

  // Geometry
  const geometry = useMemo(
    () => geometries.find((geometry) => geometry.id === material.geometry),
    [geometries, material]
  )

  // Selected
  const selected = useMemo(() => material.selected, [material.selected])

  // Type
  const type = useMemo(
    () => (geometry?.summary.dimension === 2 ? 'faces' : 'solids'),
    [geometry]
  )

  /**
   * Highlight
   */
  const highlight = useCallback((): void => {
    // Distpatch
    dispatch(enable())
    dispatch(setType(type))
    dispatch(setPart(geometry?.summary.uuid))
    dispatch(select(selected))
  }, [geometry, selected, type, dispatch])

  /**
   * Unhighlight
   */
  const unhighlight = useCallback((): void => {
    dispatch(disable())
  }, [dispatch])

  /**
   * On edit
   */
  const onEdit = useCallback((): void => {
    _onEdit(index)
  }, [index, _onEdit])

  /**
   * Render
   */
  return (
    <Card
      className={`${globalStyle.textAlignCenter} ${style.listItem}`}
      hoverable
      onMouseMove={highlight}
      onMouseLeave={unhighlight}
      actions={[
        <EditButton key="edit" onEdit={onEdit} />,
        <Delete key="delete" index={index} simulation={simulation} swr={swr} />
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
        {material.material.label}
      </Typography.Text>
    </Card>
  )
}

/**
 * List materials
 * @param props Props
 * @returns List
 */
const List: React.FunctionComponent<Props> = ({
  geometries,
  simulation,
  swr,
  onEdit
}) => {
  // Materials
  const materials = useMemo(
    () => simulation.scheme.configuration.materials!,
    [simulation]
  )

  /**
   * Render
   */
  return materials.values
    ?.map((material: IModelMaterialsValue, index: number) => {
      return (
        <ListItem
          key={material.uuid}
          geometries={geometries}
          simulation={simulation}
          material={material}
          index={index}
          swr={swr}
          _onEdit={onEdit}
        />
      )
    })
    .filter((l: any) => l)
}

export default List
