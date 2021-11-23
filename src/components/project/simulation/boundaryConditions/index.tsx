/** @namespace Components.Project.Simulation.BoundaryConditions */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Card, Layout, Space, Typography } from 'antd'

import { IGeometry, ISimulation } from '@/database/index.d'

import { AddButton } from '@/components/assets/button'
import List from './list'
import BoundaryCondition from './boundaryCondition'

import { useDispatch } from 'react-redux'
import { enable, disable, setType, setPart } from '@/store/select/action'

interface IProps {
  geometry: IGeometry
  simulation: ISimulation
  swr: {
    mutateOneSimulation: Function
  }
  setVisible: Function
}

/**
 * Boundary condition
 * @memberof Components.Project.Simulation.BoundaryConditions
 * @param {Object} props Props `{ geometry, simulation, swr, setVisible }`
 */
const BoundaryConditions = ({
  geometry,
  simulation,
  swr,
  setVisible
}: IProps): JSX.Element => {
  // State
  const [boundaryCondition, setBoundaryCondition]: [{}, Function] = useState()
  const [boundaryConditionVisible, setBoundaryConditionVisible]: [
    boolean,
    Function
  ] = useState(false)

  // Store
  const dispatch = useDispatch()

  // Data
  const boundaryConditions =
    simulation?.scheme?.configuration?.boundaryConditions

  // Part
  useEffect(() => {
    dispatch(setType('faces'))
    dispatch(setPart(geometry?.summary.uuid))
  }, [geometry])

  /**
   * On add
   */
  const onAdd = (): void => {
    setBoundaryCondition()

    setBoundaryConditionVisible(true)
    setVisible(false)
    dispatch(enable())
  }

  /**
   * On edit
   * @param type Type
   * @param index Index
   */
  const onEdit = (type: string, index: number): void => {
    const boundaryConditionToEdit = boundaryConditions[type].values[index]
    setBoundaryCondition(boundaryConditionToEdit)

    setBoundaryConditionVisible(true)
    setVisible(false)
    dispatch(enable())
  }

  /**
   * On close
   */
  const onClose = (): void => {
    setBoundaryConditionVisible(false)

    setVisible(true)
    setBoundaryCondition()
    dispatch(disable())
  }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Card>
          <AddButton disabled={!geometry} onAdd={onAdd}>
            Add boundary condition
          </AddButton>
          {geometry ? (
            <>
              <List
                simulation={simulation}
                swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
                onEdit={onEdit}
              />
              <BoundaryCondition
                visible={boundaryConditionVisible}
                simulation={simulation}
                geometry={geometry.summary}
                boundaryConditions={boundaryConditions}
                boundaryCondition={boundaryCondition}
                swr={{
                  mutateOneSimulation: swr.mutateOneSimulation
                }}
                close={onClose}
              />
            </>
          ) : (
            <Space>
              <Typography.Text>Please upload a geometry first.</Typography.Text>
            </Space>
          )}
        </Card>
      </Layout.Content>
    </Layout>
  )
}

BoundaryConditions.propTypes = {
  geometry: PropTypes.object,
  simulation: PropTypes.shape({
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object
      })
    })
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  setVisible: PropTypes.func.isRequired
}

export default BoundaryConditions
