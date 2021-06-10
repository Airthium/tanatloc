import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Layout, Space, Typography } from 'antd'

import { AddButton } from '@/components/assets/button'
import List from './list'
import BoundaryCondition from './boundaryCondition'

import { useDispatch } from 'react-redux'
import { enable, disable, setType, setPart } from '@/store/select/action'

/**
 * Errors simulation/boundaryConditions
 * @memberof module:components/project/simulation
 */
const errors = {
  updateError: 'Unable to update the simulation'
}

/**
 * Boundary condition
 * @memberof module:components/project/simulation
 * @param {Object} props Props
 */
const BoundaryConditions = ({ geometry, simulation, swr, setVisible }) => {
  // State
  const [boundaryCondition, setBoundaryCondition] = useState()
  const [boundaryConditionVisible, setBoundaryConditionVisible] =
    useState(false)

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

  const onAdd = () => {
    setBoundaryCondition()

    setBoundaryConditionVisible(true)
    setVisible(false)
    dispatch(enable())
  }

  const onEdit = (type, index) => {
    const boundaryConditionToEdit = boundaryConditions[type].values[index]
    setBoundaryCondition(boundaryConditionToEdit)

    setBoundaryConditionVisible(true)
    setVisible(false)
    dispatch(enable())
  }

  const onClose = () => {
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
