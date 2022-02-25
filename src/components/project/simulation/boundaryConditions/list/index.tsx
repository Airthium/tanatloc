/** @module Components.Simulation.BoundaryConditions.List */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Card, Typography } from 'antd'

import { ISimulation } from '@/database/index.d'
import { IModelTypedBoundaryCondition } from '@/models/index.d'

import { EditButton } from '@/components/assets/button'

import Delete from '../delete'

import { useDispatch } from 'react-redux'
import { enable, disable, select } from '@/store/select/action'

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
 */
const List = ({ simulation, swr, onEdit }: IProps): JSX.Element => {
  // State
  const [enabled, setEnabled]: [boolean, Function] = useState(true)

  // Data
  const boundaryConditions = simulation.scheme.configuration.boundaryConditions
  const dispatch = useDispatch()

  /**
   * Highlight current
   * @param key Key
   * @param index Index
   */
  const highlight = (key: string, index: number): void => {
    dispatch(enable())
    const typedBoundaryCondition = boundaryConditions[
      key
    ] as IModelTypedBoundaryCondition
    const currentSelected = typedBoundaryCondition.values[index].selected
    currentSelected?.forEach((s) => {
      dispatch(select(s.uuid))
    })
  }

  /**
   * Unhighlight current
   */
  const unhighlight = () => {
    dispatch(disable())
  }

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
