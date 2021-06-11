import PropTypes from 'prop-types'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Button } from 'antd'

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
const Add = ({ disabled, material, simulation, geometry, swr, close }) => {
  // State
  const [loading, setLoading] = useState(false)

  /**
   * On add
   */
  const onAdd = async () => {
    setLoading(true)

    try {
      // Modify selection
      const selection = geometry.solids
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

      setLoading(false)

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
  return (
    <Button disabled={disabled} loading={loading} onClick={onAdd}>
      Add
    </Button>
  )
}

Add.propTypes = {
  disabled: PropTypes.bool,
  material: PropTypes.shape({
    selected: PropTypes.array.isRequired
  }),
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
  geometry: PropTypes.shape({
    solids: PropTypes.array.isRequired
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  close: PropTypes.func.isRequired
}

export default Add
