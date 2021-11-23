import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'

import { ISimulation } from '@/database/index.d'

import { Error } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

interface IProps {
  disabled?: boolean
  material: {
    uuid: string
    selected: {}[]
  }
  simulation: ISimulation
  geometry: {
    solids: {
      uuid: string
      number: number
    }[]
  }
  swr: {
    mutateOneSimulation: Function
  }
  close: Function
}

/**
 * Errors (edit)
 * @memberof Components.Project.Simulation.Materials
 */
const errors = {
  updateError: 'Unable to edit the material'
}

/**
 * Edit material
 * @memberof Components.Project.Simulation.Materials
 * @param props Props
 */
const Edit = ({
  disabled,
  material,
  simulation,
  geometry,
  swr,
  close
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On edit
   */
  const onEdit = async (): Promise<void> => {
    setLoading(true)

    try {
      // New simulation
      const newSimulation = { ...simulation }
      const materials = newSimulation.scheme.configuration.materials

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

      // Loading
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
  geometry: PropTypes.shape({
    solids: PropTypes.array.isRequired
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  close: PropTypes.func.isRequired
}

export default Edit
