/** @module Components.Project.View */

import { useState, useEffect } from 'react'

import { ErrorNotification } from '@/components/assets/notification'

import { IGeometryPart } from '@/lib/index.d'

import {
  IFrontGeometriesItem,
  IFrontProject,
  IFrontSimulationsItem,
  IFrontResult
} from '@/api/index.d'
import GeometryAPI from '@/api/geometry'
import ResultAPI from '@/api/result'

import ThreeView from './three'

export type TGeometry = Pick<IFrontGeometriesItem, 'id' | 'needCleanup'>
export type TResult = Pick<IFrontResult, 'glb' | 'originPath'>

/**
 * Props
 */
export interface IProps {
  project: Pick<IFrontProject, 'id' | 'title'>
  simulation?: Pick<IFrontSimulationsItem, 'id'>
  geometry?: TGeometry
  result?: TResult
  postprocessing?: TResult
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
  simulation: Pick<IFrontSimulationsItem, 'id'> | undefined,
  file: Pick<IFrontGeometriesItem, 'id'> | TResult,
  type: 'geometry' | 'result'
): Promise<IGeometryPart> => {
  try {
    if (type === 'geometry') {
      const geometry = file as Pick<IFrontGeometriesItem, 'id'>
      return await GeometryAPI.getPart({ id: geometry.id })
    } else {
      const result = file as Pick<IFrontResult, 'glb' | 'originPath' | 'json'>
      return await ResultAPI.load(
        { id: simulation!.id },
        { originPath: result.originPath, glb: result.glb! }
      )
    }
  } catch (err) {
    ErrorNotification(errors.part, err)
    throw err
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
  result,
  postprocessing
}: IProps): JSX.Element => {
  // State
  const [part, setPart] = useState<IGeometryPart>()
  const [previous, setPrevious] = useState<TGeometry | TResult>()
  const [loading, setLoading] = useState<boolean>(false)

  // Part
  useEffect(() => {
    if (simulation && postprocessing) {
      if (postprocessing.glb !== (previous as TResult)?.glb) {
        setPrevious(postprocessing)

        setLoading(true)
        loadPart(simulation, postprocessing, 'result')
          .then((partLoaded) => setPart(partLoaded))
          .catch((_err) => undefined)
          .finally(() => setLoading(false))
      }
    } else if (simulation && result) {
      if (result.glb !== (previous as TResult)?.glb) {
        setPrevious(result)

        setLoading(true)
        loadPart(simulation, result, 'result')
          .then((partLoaded) => setPart(partLoaded))
          .catch((_err) => undefined)
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
          loadPart(undefined, geometry, 'geometry')
            .then((partLoaded) => setPart(partLoaded))
            .catch((_err) => undefined)
            .finally(() => setLoading(false))
        }
      }
    }
  }, [simulation, geometry, result, postprocessing, previous])

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

export default View
