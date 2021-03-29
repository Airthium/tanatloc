import PropTypes from 'prop-types'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

import { AddButton } from '@/components/assets/button'
import { Error } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

/**
 * Errors material/add
 * @memberof module:components/project/simulation
 */
const errors = {
  updateError: 'Unable to add the material'
}

/**
 * Add material
 * @memberof module:components/project/simulation
 * @param {Object} props Props
 */
const Add = ({ material, simulation, part, disabled, swr, close }) => {
  // State
  const [loading, setLoading] = useState(false)

  /**
   * On add
   */
  const onAdd = async () => {
    setLoading(true)

    try {
      // Modify selection
      const selection = part.solids
        .map((s) => {
          if (material.selected.includes(s.uuid))
            return {
              uuid: s.uuid,
              label: s.number
            }
        })
        .filter((s) => s)
      material.selected = selection

      // Set uuid
      material.uuid = uuid()

      // New simulation
      const newSimulation = { ...simulation }

      // Update local
      const materials = newSimulation.scheme.configuration.materials
      materials.values = [...(materials.values || []), material]

      // Diff
      const diff = {
        ...materials,
        done: true
      }

      // API
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'set',
          path: ['configuration', 'materials'],
          value: diff
        }
      ])

      // Local
      swr.mutateOneSimulation(newSimulation)

      // Close
      close()
    } catch (err) {
      Error(errors.updateError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return <AddButton disabled={disabled} loading={loading} onAdd={onAdd} />
}

Add.propTypes = {
  material: PropTypes.shape({
    selected: PropTypes.array.isRequired
  }).isRequired,
  simulation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        materials: PropTypes.shape({
          values: PropTypes.array
        }).isRequired
      }).isRequired
    }).isRequired
  }),
  part: PropTypes.shape({
    solids: PropTypes.array.isRequired
  }).isRequired,
  disabled: PropTypes.bool,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  close: PropTypes.func.isRequired
}

export default Add
