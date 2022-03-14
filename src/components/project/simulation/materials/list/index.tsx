/** @module Components.Project.Simulation.Materials.List */

import PropTypes from 'prop-types'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState
} from 'react'
import { Card, Typography } from 'antd'

import { ISimulation } from '@/database/index.d'
import { IModelMaterialValue } from '@/models/index.d'

import { EditButton } from '@/components/assets/button'

import Delete from '../delete'

import { SelectContext } from '@/context/select'
import { enable, disable, select } from '@/context/select/actions'

/**
 * Props
 */
export interface IProps {
  simulation: ISimulation
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
  onEdit: (index: number) => void
}

/**
 * List materials
 * @param props Props
 * @returns List
 */
const List = ({ simulation, swr, onEdit }: IProps): JSX.Element => {
  // State
  const [enabled, setEnabled]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(true)

  // Data
  const materials = simulation.scheme.configuration.materials
  const { dispatch } = useContext(SelectContext)

  /**
   * Highlight current
   * @param {number} index Index
   */
  const highlight = useCallback(
    (index: number): void => {
      dispatch(enable())
      const currentSelected = materials.values[index].selected
      currentSelected?.forEach((s) => {
        dispatch(select(s))
      })
    },
    [materials, dispatch]
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
        ?.map((material: IModelMaterialValue, index: number) => {
          return (
            <Card
              className="material-item text-center"
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
              <Typography.Text strong className="text-center">
                {material.material.label}
              </Typography.Text>
            </Card>
          )
        })
        .filter((l: any) => l)}
    </>
  )
}

List.propTypes = {
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        materials: PropTypes.shape({
          values: PropTypes.array
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired
}

export default List
