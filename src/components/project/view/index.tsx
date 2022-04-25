/** @module Components.Project.View */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

import { ErrorNotification } from '@/components/assets/notification'

import {
  IFrontGeometriesItem,
  IFrontProject,
  IFrontSimulationsItem,
  IFrontResult
} from '@/api/index.d'
import GeometryAPI from '@/api/geometry'
import ResultAPI from '@/api/result'

import ThreeView from './three'

type TGeometry = Pick<IFrontGeometriesItem, 'id' | 'dimension' | 'needCleanup'>
type TResult = Pick<IFrontResult, 'glb' | 'originPath' | 'json'>

/**
 * Props
 */
export interface IProps {
  project: Pick<IFrontProject, 'id' | 'title'>
  simulation?: Pick<IFrontSimulationsItem, 'id'>
  geometry?: TGeometry
  result?: TResult
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
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  file: Pick<IFrontGeometriesItem, 'id'> | TResult,
  type: 'geometry' | 'result'
): Promise<{ uuid: string; buffer: Buffer } | undefined> => {
  try {
    if (type === 'geometry') {
      const geometry = file as Pick<IFrontGeometriesItem, 'id'>
      return await GeometryAPI.getPart({ id: geometry.id })
    } else {
      const result = file as Pick<IFrontResult, 'glb' | 'originPath' | 'json'>
      return await ResultAPI.load(
        { id: simulation.id },
        { originPath: result.originPath, glb: result.glb!, json: result.json! }
      )
    }
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
  const [part, setPart] = useState<{
    uuid?: string
    buffer?: Buffer
    dimension?: number
  }>()
  const [previous, setPrevious] = useState<TGeometry | TResult>()
  const [loading, setLoading] = useState<boolean>(false)

  // Part
  useEffect(() => {
    if (simulation) {
      if (result) {
        if (result.glb !== (previous as TResult)?.glb) {
          setPrevious(result)

          setLoading(true)
          loadPart(simulation, result, 'result')
            .then((partLoaded) =>
              setPart({ ...partLoaded, dimension: geometry?.dimension })
            )
            .finally(() => setLoading(false))
        }
      } else if (geometry) {
        if (geometry.id !== (previous as TGeometry)?.id) {
          setPrevious(geometry)

          setLoading(true)
          if (geometry.needCleanup) {
            setPart(undefined)
            setLoading(false)
          } else {
            loadPart(simulation, geometry, 'geometry')
              .then((partLoaded) =>
                setPart({ ...partLoaded, dimension: geometry.dimension })
              )
              .finally(() => setLoading(false))
          }
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
        id: project.id,
        title: project.title
      }}
      part={part}
    />
  )
}

View.propTypes = {
  project: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired
  }),
  geometry: PropTypes.exact({
    id: PropTypes.string.isRequired,
    dimension: PropTypes.number,
    needCleanup: PropTypes.bool
  }),
  result: PropTypes.exact({
    glb: PropTypes.string.isRequired,
    originPath: PropTypes.string.isRequired,
    json: PropTypes.string.isRequired
  })
}

export default View
