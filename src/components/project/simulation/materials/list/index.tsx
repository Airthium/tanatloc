/** @module Components.Project.Simulation.Materials.List */

import { useCallback, useContext, useMemo, useState } from 'react'
import { Card, Typography } from 'antd'
import { css } from '@emotion/react'

import { IModelMaterialsValue } from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontGeometriesItem
} from '@/api/index.d'

import { SelectContext } from '@/context/select'
import { enable, disable, select, setPart } from '@/context/select/actions'

import { EditButton } from '@/components/assets/button'

import Delete from '../delete'

import { globalStyle } from '@/styles'
import style from '../../index.style'

/**
 * Props
 */
export interface IProps {
  geometries: Pick<IFrontGeometriesItem, 'id' | 'summary'>[]
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
  onEdit: (index: number) => void
}

export interface IListItemProps {
  geometries: Pick<IFrontGeometriesItem, 'id' | 'summary'>[]
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  material: IModelMaterialsValue
  index: number
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
  _onEdit: (index: number) => void
}

const ListItem = ({
  geometries,
  simulation,
  material,
  index,
  swr,
  _onEdit
}: IListItemProps): JSX.Element => {
  // State
  const [enabled, setEnabled] = useState<boolean>(true)

  // Context
  const { dispatch } = useContext(SelectContext)

  /**
   * Highlight
   */
  const highlight = useCallback((): void => {
    dispatch(enable())

    // Geometry
    const geometryId = material.geometry
    const geometry = geometries.find((geometry) => geometry.id === geometryId)
    dispatch(setPart(geometry?.summary.uuid))

    // Selected
    const currentSelected = material.selected
    currentSelected?.forEach((s) => {
      dispatch(select(s))
    })
  }, [geometries, material, dispatch])

  /**
   * Unhighlight
   */
  const unhighlight = useCallback((): void => {
    enabled && dispatch(disable())
  }, [enabled, dispatch])

  /**
   * On edit
   */
  const onEdit = useCallback(() => {
    setEnabled(false)
    _onEdit(index)
    setTimeout(() => setEnabled(true), 500)
  }, [index, _onEdit])

  /**
   * Render
   */
  return (
    <Card
      css={css([globalStyle.textAlignCenter, style.listItem])}
      hoverable
      onMouseEnter={highlight}
      onMouseLeave={unhighlight}
      actions={[
        <EditButton key="edit" onEdit={onEdit} />,
        <Delete key="delete" index={index} simulation={simulation} swr={swr} />
      ]}
    >
      <Typography.Text strong css={globalStyle.textAlignCenter}>
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
const List = ({ geometries, simulation, swr, onEdit }: IProps): JSX.Element => {
  // Data
  const materials = useMemo(
    () => simulation.scheme.configuration.materials!,
    [simulation]
  )

  /**
   * Render
   */
  return (
    <>
      {materials.values
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
        .filter((l: any) => l)}
    </>
  )
}

export default List
