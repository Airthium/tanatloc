import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'

import { Error } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

/**
 * Errors materials/edit
 * @memberof module:components/project/simulation
 */
const errors = {
  updateError: 'Unable to edit the material'
}

/**
 * Edit material
 * @memberof module:components/project/simulation
 * @param {Object} props Props
 */
const Edit = ({ disabled, material, simulation, part, swr, close }) => {
  // State
  const [loading, setLoading] = useState()

  /**
   * On edit
   */
  const onEdit = async () => {
    setLoading(true)

    try {
      // New simulation
      const newSimulation = { ...simulation }
      const materials = newSimulation.scheme.configuration.materials

      // Modify selection
      const selection = part.solids
        .map((f) => {
          if (material.selected.includes(f.uuid))
            return {
              uuid: f.uuid,
              label: f.number
            }
        })
        .filter((s) => s)
      material.selected = selection

      // Update local
      const index = materials.values.findIndex((m) => m.uuid === material.uuid)
      materials.values = [
        ...materials.values.slice(0, index),
        material,
        ...materials.values.slice(index + 1)
      ]

      // Diff
      const diff = {
        ...materials
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
  return (
    <Button disabled={disabled} loading={loading} onClick={onEdit}>
      Edit
    </Button>
  )
}

Edit.propTypes = {
  disabled: PropTypes.bool,
  material: PropTypes.shape({
    selected: PropTypes.array.isRequired,
    uuid: PropTypes.string.isRequired
  }).isRequired,
  simulation: PropTypes.shape({
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        materials: PropTypes.shape({
          values: PropTypes.array.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  part: PropTypes.shape({
    solids: PropTypes.array.isRequired
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  close: PropTypes.func.isRequired
}

export default Edit
