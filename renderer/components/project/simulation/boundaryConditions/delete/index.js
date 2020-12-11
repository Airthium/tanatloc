import { useState } from 'react'
import { message, Button, Popconfirm } from 'antd'
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'

import { useDispatch } from 'react-redux'
import { unselect } from '../../../../../store/select/action'

import SimulationAPI from '../../../../../../src/api/simulation'

import Sentry from '../../../../../../src/lib/sentry'

/**
 * Errors boundaryConditions/delete
 * @memberof module:renderer/components/project/simulation
 */
const errors = {
  updateError: 'Unable to delete the boundary condition'
}

/**
 * Delete boundary condition
 * @memberof module:renderer/components/project/simulation
 * @param {Object} props Props
 */
const Delete = ({ project, simulation, type, index }) => {
  // State
  const [loading, setLoading] = useState()

  // Data
  const [, { mutateOneSimulation }] = SimulationAPI.useSimulations(
    project?.simulations
  )
  const dispatch = useDispatch()

  /**
   * On delete
   */
  const onDelete = async () => {
    setLoading(true)

    try {
      // New simulation
      const newSimulation = { ...simulation }

      // Update local
      const boundaryConditions =
        newSimulation.scheme.configuration.boundaryConditions
      const typedBoundaryCondition = boundaryConditions[type]

      // (unselect)
      const boundaryCondition = typedBoundaryCondition.values[index]
      boundaryCondition.selected.forEach((s) => {
        dispatch(unselect(s.uuid))
      })

      typedBoundaryCondition.values = [
        ...typedBoundaryCondition.values.slice(0, index),
        ...typedBoundaryCondition.values.slice(index + 1)
      ]

      // Diff
      const diff = {
        ...boundaryConditions,
        done: !!boundaryConditions.length
      }

      // Update
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'diff',
          path: ['configuration', 'boundaryConditions'],
          value: diff
        }
      ])

      mutateOneSimulation(newSimulation)
    } catch (err) {
      message.error(errors.updateError)
      console.error(err)
      Sentry.captureException(err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <Popconfirm
      title="Are you sure"
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      onConfirm={onDelete}
    >
      <Button loading={loading} icon={<DeleteOutlined />} />
    </Popconfirm>
  )
}

export default Delete
