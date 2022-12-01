/** @module Components.Project.Simulation.Materials.List */

import { useCallback, useContext, useState } from 'react'
import { Card, Typography } from 'antd'
import { css } from '@emotion/react'

import { IModelMaterialsValue } from '@/models/index.d'

import { EditButton } from '@/components/assets/button'

import Delete from '../delete'

import { SelectContext } from '@/context/select'
import { enable, disable, select, setPart } from '@/context/select/actions'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontGeometriesItem
} from '@/api/index.d'

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

/**
 * List materials
 * @param props Props
 * @returns List
 */
const List = ({ geometries, simulation, swr, onEdit }: IProps): JSX.Element => {
  // State
  const [enabled, setEnabled] = useState<boolean>(true)

  // Context
  const { dispatch } = useContext(SelectContext)

  // Data
  const materials = simulation.scheme.configuration.materials!

  /**
   * Highlight current
   * @param index Index
   */
  const highlight = useCallback(
    (index: number): void => {
      dispatch(enable())

      // Geometry
      const geometryId = materials.values![index].geometry
      const geometry = geometries.find((geometry) => geometry.id === geometryId)
      dispatch(setPart(geometry!.summary.uuid))

      // Selected
      const currentSelected = materials.values![index].selected
      currentSelected?.forEach((s) => {
        dispatch(select(s))
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [`${geometries}`, materials, dispatch]
  )

  /**
   * Unhighlight current
   */
  const unhighlight = useCallback((): void => {
    dispatch(disable())
  }, [dispatch])

  /**
   * Render
   */
  return (
    <>
      {materials.values
        ?.map((material: IModelMaterialsValue, index: number) => {
          return (
            <Card
              css={css([globalStyle.textAlignCenter, style.listItem])}
              key={index}
              hoverable
              onMouseEnter={() => highlight(index)}
              onMouseLeave={() => {
                enabled && unhighlight()
              }}
              actions={[
                <EditButton
                  key="edit"
                  onEdit={() => {
                    setEnabled(false)
                    onEdit(index)
                    setTimeout(() => setEnabled(true), 500)
                  }}
                />,
                <Delete
                  key="delete"
                  index={index}
                  simulation={{
                    id: simulation.id,
                    scheme: simulation.scheme
                  }}
                  swr={{
                    mutateOneSimulation: swr.mutateOneSimulation
                  }}
                />
              ]}
            >
              <Typography.Text strong css={globalStyle.textAlignCenter}>
                {material.material.label}
              </Typography.Text>
            </Card>
          )
        })
        .filter((l: any) => l)}
    </>
  )
}

export default List
