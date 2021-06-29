import { useState } from 'react'
import { Button } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

import { Error as ErrorNotification } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

/**
 * Errors
 */
const errors = {
  copy: 'Unable to copy simulation'
}

/**
 * Copy simulation
 * @memberof module:components/project/simulation
 */
const Copy = ({ project, simulation, swr }) => {
  // State
  const [loading, setLoading] = useState(false)

  /**
   * On copy
   */
  const onCopy = async () => {
    setLoading(true)
    try {
      // Clear results
      const newScheme = { ...simulation.scheme }
      newScheme.configuration.run.done = false
      newScheme.configuration.run.error = null
      newScheme.configuration.run.results = null

      // API
      const newSimulation = await SimulationAPI.add(
        { id: project.id },
        { name: simulation.name + ' (copy)', scheme: newScheme }
      )

      // Mutate simulations
      swr.addOneSimulation(newSimulation)

      // Mutate project
      swr.mutateProject({
        id: project.id,
        simulations: [...(project.simulations || []), newSimulation]
      })
    } catch (err) {
      ErrorNotification(errors.copy, err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <Button loading={loading} icon={<CopyOutlined />} onClick={onCopy}>
      Copy
    </Button>
  )
}

export default Copy
