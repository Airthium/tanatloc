/** @module Components.Project.Simulation.BoundaryConditions.List */

import { useCallback, useContext, useState } from 'react'
import { Card, Typography } from 'antd'

import { IModelTypedBoundaryCondition } from '@/models/index.d'

import { EditButton } from '@/components/assets/button'

import { SelectContext } from '@/context/select'
import { enable, disable, select, setPart } from '@/context/select/actions'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontGeometriesItem
} from '@/api/index.d'

import style from '../../index.style'

import Delete from '../delete'

/**
 * Props
 */
export interface IProps {
  geometries: Pick<IFrontGeometriesItem, 'id' | 'summary'>[]
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
  onEdit: (type: string, index: number) => void
}

/**
 * List
 * @param props Props
 * @returns List
 */
const List = ({ geometries, simulation, swr, onEdit }: IProps): JSX.Element => {
  // State
  const [enabled, setEnabled] = useState<boolean>(true)

  // Context
  const { dispatch } = useContext(SelectContext)

  // Data
  const boundaryConditions = simulation.scheme.configuration.boundaryConditions

  /**
   * Highlight current
   * @param key Key
   * @param index Index
   */
  const highlight = useCallback(
    (key: string, index: number): void => {
      dispatch(enable())

      const typedBoundaryCondition = boundaryConditions[
        key
      ] as IModelTypedBoundaryCondition

      // Geometry
      const geometryId = typedBoundaryCondition.values![index].geometry
      const geometry = geometries.find((geometry) => geometry.id === geometryId)
      dispatch(setPart(geometry?.summary.uuid))

      // Selected
      const currentSelected = typedBoundaryCondition.values![index].selected
      currentSelected?.forEach((s) => {
        dispatch(select(s))
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [`${geometries}`, boundaryConditions, dispatch]
  )

  /**
   * Unhighlight current
   */
  const unhighlight = useCallback(() => {
    dispatch(disable())
  }, [dispatch])

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
              <Card
                css={style.listItem}
                key={index}
                hoverable
                onMouseEnter={() => highlight(type, index)}
                onMouseLeave={() => {
                  enabled && unhighlight()
                }}
                actions={[
                  <EditButton
                    key="edit"
                    onEdit={() => {
                      setEnabled(false)
                      onEdit(type, index)
                      setTimeout(() => setEnabled(true), 500)
                    }}
                  />,
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
                <Typography.Text strong>{child.name}</Typography.Text>{' '}
                <Typography.Text>
                  ({typedBoundaryCondition.label})
                </Typography.Text>
              </Card>
            )
          })
        })
        .filter((l) => l)}
    </>
  )
}

export default List
