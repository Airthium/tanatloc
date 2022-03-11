/** @module Components.Project.View */

import PropTypes from 'prop-types'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'

import { IGeometry, ISimulation, ISimulationTaskFile } from '@/database/index.d'
import { IProjectWithData } from '@/lib/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import GeometryAPI from '@/api/geometry'
import ResultAPI from '@/api/result'

import ThreeView from './three'

/**
 * Props
 */
export interface IProps {
  project: IProjectWithData
  simulation?: ISimulation
  geometry?: IGeometry & { needCleanup?: boolean }
  result?: Omit<Omit<ISimulationTaskFile, 'fileName'>, 'type'>
}

/**
 * Errors
 */
export const errors = {
  part: 'Unable to load part'
}

/**
 * Load part
 * @param simulation Simulation
 * @param file File
 * @param type Type
 * @returns Part
 */
const loadPart = async (
  simulation: ISimulation,
  file: {
    id?: string
    originPath?: string
    glb?: string
    json?: string
  },
  type: string
): Promise<{ uuid?: string; buffer: Buffer }> => {
  try {
    if (type === 'geometry') return await GeometryAPI.getPart({ id: file.id })
    else
      return await ResultAPI.load(
        { id: simulation.id },
        { originPath: file.originPath, glb: file.glb, json: file.json }
      )
  } catch (err) {
    ErrorNotification(errors.part, err)
  }
}

/**
 * View
 * @param props Props
 * @returns View
 */
const View = ({
  project,
  simulation,
  geometry,
  result
}: IProps): JSX.Element => {
  // State
  const [part, setPart]: [
    { uuid?: string; buffer: Buffer },
    Dispatch<SetStateAction<{ uuid?: string; buffer: Buffer }>>
  ] = useState()
  const [previous, setPrevious]: [
    IProps['geometry'] | IProps['result'],
    Dispatch<SetStateAction<IGeometry | IProps['geometry'] | IProps['result']>>
  ] = useState()
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  // Part
  useEffect(() => {
    if (simulation && result) {
      if (result.glb !== (previous as IProps['result'])?.glb) {
        setPrevious(result)

        setLoading(true)
        loadPart(simulation, result, 'result')
          .then(setPart)
          .finally(() => setLoading(false))
      }
    } else if (geometry) {
      if (geometry.id !== (previous as IProps['geometry'])?.id) {
        setPrevious(geometry)

        setLoading(true)
        if (geometry.needCleanup) {
          setPart(null)
          setLoading(false)
        } else {
          loadPart(simulation, geometry, 'geometry')
            .then(setPart)
            .finally(() => setLoading(false))
        }
      }
    }
  }, [simulation, geometry, result, previous])

  /**
   * Render
   */
  return (
    <ThreeView
      loading={loading}
      project={{
        id: project.id
      }}
      part={part}
    />
  )
}

View.propTypes = {
  project: PropTypes.exact({
    id: PropTypes.string.isRequired
  }).isRequired,
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired
  }),
  geometry: PropTypes.exact({
    id: PropTypes.string.isRequired,
    needCleanup: PropTypes.bool
  }),
  result: PropTypes.exact({
    glb: PropTypes.string.isRequired,
    originPath: PropTypes.string.isRequired,
    json: PropTypes.string.isRequired
  })
}

export default View
