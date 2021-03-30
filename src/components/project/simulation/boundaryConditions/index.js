import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Layout } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

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
const BoundaryConditions = ({ simulation, part, swr, setVisible }) => {
  // State
  const [boundaryCondition, setBoundaryCondition] = useState()
  const [boundaryConditionVisible, setBoundaryConditionVisible] = useState(
    false
  )

  // Store
  const dispatch = useDispatch()

  // Data
  const boundaryConditions =
    simulation?.scheme?.configuration?.boundaryConditions

  // Part
  useEffect(() => {
    dispatch(setType('faces'))
    dispatch(setPart(part?.uuid))
  }, [part])

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
        <AddButton icon={<PlusCircleOutlined />} onAdd={onAdd}>
          Add boundary condition
        </AddButton>
        <List
          simulation={simulation}
          swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
          onEdit={onEdit}
        />
        <BoundaryCondition
          visible={boundaryConditionVisible}
          simulation={simulation}
          part={part}
          boundaryConditions={boundaryConditions}
          boundaryCondition={boundaryCondition}
          swr={{
            mutateOneSimulation: swr.mutateOneSimulation
          }}
          close={onClose}
        />
      </Layout.Content>
    </Layout>
  )
}

BoundaryConditions.propTypes = {
  simulation: PropTypes.shape({
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object
      })
    })
  }).isRequired,
  part: PropTypes.shape({
    uuid: PropTypes.string
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  setVisible: PropTypes.func.isRequired
}

export default BoundaryConditions
