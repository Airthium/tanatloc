import PropTypes from 'prop-types'
import { useState } from 'react'
import { Card, Typography } from 'antd'

import { ISimulation } from '@/database/index.d'

import { EditButton } from '@/components/assets/button'

import { useDispatch } from 'react-redux'
import { enable, disable, select } from '@/store/select/action'

import Delete from '../delete'

export interface IProps {
  simulation: ISimulation
  swr: {
    mutateOneSimulation: Function
  }
  onEdit: Function
}

/**
 * List
 * @memberof Components.Project.Simulation.BoundaryConditions
 * @param props Props
 */
const List = ({ simulation, swr, onEdit }: IProps): JSX.Element => {
  // State
  const [enabled, setEnabled]: [boolean, Function] = useState(true)

  // Data
  const boundaryConditions =
    simulation?.scheme?.configuration?.boundaryConditions || {}
  const dispatch = useDispatch()

  /**
   * Highlight current
   * @param key Key
   * @param index Index
   */
  const highlight = (key: string, index: number): void => {
    dispatch(enable())
    const currentSelected = boundaryConditions[key]?.values[index]?.selected
    currentSelected?.forEach((s: { uuid: string }) => {
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
          return boundaryConditions[type].values?.map(
            (child: { name: string }, index: number) => {
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
                      onEdit={() => {
                        setEnabled(false)
                        onEdit(type, index)
                        setTimeout(() => setEnabled(true), 500)
                      }}
                    />,
                    <Delete
                      simulation={simulation}
                      type={type}
                      index={index}
                      swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
                    />
                  ]}
                >
                  <Typography.Text>{child.name}</Typography.Text>
                </Card>
              )
            }
          )
        })
        .filter((l) => l)}
    </>
  )
}

List.propTypes = {
  simulation: PropTypes.shape({
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object
      })
    })
  }),
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired
}

export default List
