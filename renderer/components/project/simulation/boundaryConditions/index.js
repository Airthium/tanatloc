import { useState, useEffect } from 'react'
import { Button, Layout } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import List from './list'
import BoundaryCondition from './boundaryCondition'

import { useDispatch } from 'react-redux'
import {
  enable,
  disable,
  setType,
  setPart
} from '../../../../store/select/action'

/**
 * Errors simulation/boundaryConditions
 * @memberof module:renderer/components/project/simulation
 */
const errors = {
  updateError: 'Unable to update the simulation'
}

/**
 * Boundary condition
 * @memberof module:renderer/components/project/simulation
 * @param {Object} props Props
 */
const BoundaryConditions = ({ project, simulation, part, setVisible }) => {
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
        <Button icon={<PlusCircleOutlined />} onClick={onAdd} />
        <List project={project} simulation={simulation} onEdit={onEdit} />
        <BoundaryCondition
          project={project}
          simulation={simulation}
          visible={boundaryConditionVisible}
          part={part}
          boundaryConditions={boundaryConditions}
          boundaryCondition={boundaryCondition}
          close={onClose}
        />
      </Layout.Content>
    </Layout>
  )
}

export default BoundaryConditions

// import Si
