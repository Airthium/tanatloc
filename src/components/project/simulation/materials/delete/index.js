import { useState } from 'react'

import { Error } from '@/components/assets/notification'
import { DeleteButton } from '@/components/assets/button'

import { useDispatch } from 'react-redux'
import { unselect } from '@/store/select/action'

import SimulationAPI from '@/api/simulation'

const errors = {
  updateError: 'Unable to delete the material'
}

/**
 * Delete material
 * @param {Object} props Props
 */
const Delete = ({ project, simulation, index }) => {
  // State
  const [loading, setLoading] = useState(false)

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
      const materials = newSimulation?.scheme?.configuration?.materials
      const material = materials.values[index]

      // (unselect)
      material.selected.forEach((s) => {
        dispatch(unselect(s.uuid))
      })

      materials.values = [
        ...materials.values.slice(0, index),
        ...materials.values.slice(index + 1)
      ]

      // Diff
      const diff = {
        ...materials,
        done: !!materials.values.length
      }

      // Update
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'set',
          path: ['configuration', 'materials'],
          value: diff
        }
      ])

      // Mutate
      mutateOneSimulation(newSimulation)
    } catch (err) {
      Error(errors.updateError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return <DeleteButton loading={loading} onDelete={onDelete} />
}

export default Delete
