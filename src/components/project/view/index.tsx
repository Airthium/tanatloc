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

export type TGeometry = Pick<IFrontGeometriesItem, 'id' | 'needCleanup'> & {
  visible?: boolean
}
export type TResult = Pick<IFrontResult, 'glb' | 'originPath'>

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
const loadPart = async (
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
  useEffect(() => {
    ;(async () => {
      setLoading(true)

      try {
        const newParts = []

        // Result
        if (!postprocessing && result) {
          const prevPart = parts.find((part) => part.extra?.glb === result.glb)
          if (prevPart) {
            newParts.push(prevPart)
          } else {
            const partContent = await loadPart(simulation, result, 'result')
            newParts.push(partContent)
          }
        }

        // Postprocessing
        if (postprocessing) {
          const prevPart = parts.find(
            (part) => part.extra?.glb === postprocessing.glb
          )
          if (prevPart) {
            newParts.push(prevPart)
          } else {
            const partContent = await loadPart(
              simulation,
              postprocessing,
              'result'
            )
            newParts.push(partContent)
          }
        }

        // Geometries
        if (geometries.length) {
          await Promise.all(
            geometries.map(async (geometry) => {
              const prevPart = parts.find(
                (part) => part.extra?.id === geometry.id
              )
              if (prevPart) {
                newParts.push(prevPart)
              } else {
                const partContent = await loadPart(
                  simulation,
                  geometry,
                  'geometry'
                )
                newParts.push(partContent)
              }
            })
          )
        }

        setParts(newParts)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulation, `${geometries}`, result, postprocessing, `${parts}`])

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
