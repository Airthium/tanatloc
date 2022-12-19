/** @module Components.Project.View */

import { useState } from 'react'

import {
  IFrontGeometriesItem,
  IFrontProject,
  IFrontSimulationsItem,
  IFrontResult
} from '@/api/index.d'

import useCustomEffect from '@/components/utils/useCustomEffect'

import { ErrorNotification } from '@/components/assets/notification'

import { IGeometryPart } from '@/lib/index.d'

import GeometryAPI from '@/api/geometry'
import ResultAPI from '@/api/result'

import ThreeView from './three'

// Local interfaces
export interface TGeometry
  extends Pick<IFrontGeometriesItem, 'id' | 'needCleanup'> {
  visible?: boolean
}

export interface TResult extends Pick<IFrontResult, 'glb' | 'originPath'> {}

/**
 * Props
 */
export interface IProps {
  project: Pick<IFrontProject, 'id' | 'title'>
  simulation?: Pick<IFrontSimulationsItem, 'id'>
  geometries: TGeometry[]
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
export const _loadPart = async (
  simulation: Pick<IFrontSimulationsItem, 'id'> | undefined,
  file: Pick<IFrontGeometriesItem, 'id'> | TResult,
  type: 'geometry' | 'result'
): Promise<IGeometryPart> => {
  try {
    if (type === 'geometry') {
      const geometry = file as Pick<IFrontGeometriesItem, 'id'>
      const part = await GeometryAPI.getPart({ id: geometry.id })
      return { ...part, extra: { id: geometry.id } }
    } else {
      const result = file as Pick<IFrontResult, 'glb' | 'originPath' | 'json'>
      const part = await ResultAPI.load(
        { id: simulation!.id },
        { originPath: result.originPath, glb: result.glb! }
      )
      return { ...part, extra: { glb: result.glb } }
    }
  } catch (err) {
    ErrorNotification(errors.part, err)
    throw err
  }
}

/**
 * Load result
 * @param simulation Simulation
 * @param parts Parts
 * @param result Result
 * @param postprocessing Postprocessing
 * @returns Result
 */
export const _loadResult = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  parts: IGeometryPart[],
  result?: TResult,
  postprocessing?: TResult
): Promise<IGeometryPart | undefined> => {
  if (!postprocessing && result) {
    const prevPart = parts.find((part) => part.extra?.glb === result.glb)
    if (prevPart) {
      return prevPart
    } else {
      const partContent = await _loadPart(simulation, result, 'result')
      return partContent
    }
  }
}

/**
 * Load postprocessing
 * @param simulation Simulation
 * @param parts Parts
 * @param postprocessing Postprocessing
 * @returns Postprocessing
 */
export const _loadPostprocessing = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  parts: IGeometryPart[],
  postprocessing?: TResult
): Promise<IGeometryPart | undefined> => {
  if (postprocessing) {
    const prevPart = parts.find(
      (part) => part.extra?.glb === postprocessing.glb
    )
    if (prevPart) {
      return prevPart
    } else {
      const partContent = await _loadPart(simulation, postprocessing, 'result')
      return partContent
    }
  }
}

/**
 * Load geometries
 * @param simulation Simulation
 * @param parts Parts
 * @param geometries Geometries
 * @returns Geometries
 */
export const _loadGeometries = async (
  simulation: Pick<IFrontSimulationsItem, 'id'> | undefined,
  parts: IGeometryPart[],
  geometries: TGeometry[]
): Promise<IGeometryPart[]> => {
  return Promise.all(
    geometries.map(async (geometry) => {
      const prevPart = parts.find((part) => part.extra?.id === geometry.id)
      if (prevPart) {
        return prevPart
      } else {
        const partContent = await _loadPart(simulation, geometry, 'geometry')
        return partContent
      }
    })
  )
}

/**
 * View
 * @param props Props
 * @returns View
 */
const View = ({
  project,
  simulation,
  geometries,
  result,
  postprocessing
}: IProps): JSX.Element => {
  // State
  const [parts, setParts] = useState<IGeometryPart[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Parts
  useCustomEffect(() => {
    ;(async () => {
      setLoading(true)

      try {
        const newParts = []

        // Result
        if (simulation) {
          const newResult = await _loadResult(
            simulation,
            parts,
            result,
            postprocessing
          )
          newResult && newParts.push(newResult)
        }

        // Postprocessing
        if (simulation) {
          const newPostprocessing = await _loadPostprocessing(
            simulation,
            parts,
            postprocessing
          )
          newPostprocessing && newParts.push(newPostprocessing)
        }

        // Geometries
        const newGeometries = await _loadGeometries(
          simulation,
          parts,
          geometries
        )
        newParts.push(...newGeometries)

        setParts(newParts)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    })()
  }, [simulation, geometries, result, postprocessing, parts])

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
      parts={parts}
    />
  )
}

export default View
