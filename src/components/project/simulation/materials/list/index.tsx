import PropTypes from 'prop-types'
import { useState } from 'react'
import { Card, Typography } from 'antd'

import { ISimulation } from '@/database/index.d'
import { IModelMaterialValue } from '@/models/index.d'

import { EditButton } from '@/components/assets/button'

import Delete from '../delete'

import { useDispatch } from 'react-redux'
import { enable, disable, select } from '@/store/select/action'

export interface IProps {
  simulation: ISimulation
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
  onEdit: (index: number) => void
}

/**
 * List materials
 * @memberof Components.Project.Simulation.Materials
 * @param props Props
 */
const List = ({ simulation, swr, onEdit }: IProps): JSX.Element => {
  // State
  const [enabled, setEnabled]: [boolean, Function] = useState(true)

  // Data
  const materials = simulation.scheme.configuration.materials
  const dispatch = useDispatch()

  /**
   * Highlight current
   * @param {number} index Index
   */
  const highlight = (index: number): void => {
    dispatch(enable())
    const currentSelected = materials.values[index].selected
    currentSelected?.forEach((s: { uuid: string }) => {
      dispatch(select(s.uuid))
    })
  }

  /**
   * Unhighlight current
   */
  const unhighlight = (): void => {
    dispatch(disable())
  }

  /**
   * Render
   */
  return (
    <>
      {materials.values
        ?.map((material: IModelMaterialValue, index: number) => {
          return (
            <Card
              className="material-item"
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
