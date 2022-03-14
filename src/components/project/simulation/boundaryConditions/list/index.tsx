/** @module Components.Simulation.BoundaryConditions.List */

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
import { IModelTypedBoundaryCondition } from '@/models/index.d'

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
  onEdit: (type: string, index: number) => void
}

/**
 * List
 * @param props Props
 * @returns List
 */
const List = ({ simulation, swr, onEdit }: IProps): JSX.Element => {
  // State
  const [enabled, setEnabled]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(true)

  // Data
  const boundaryConditions = simulation.scheme.configuration.boundaryConditions
  const { dispatch } = useContext(SelectContext)

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
      const currentSelected = typedBoundaryCondition.values[index].selected
      currentSelected?.forEach((s) => {
        dispatch(select(s))
      })
    },
    [boundaryConditions, dispatch]
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
                className="boundaryCondition-item"
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

List.propTypes = {
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired
}

export default List
