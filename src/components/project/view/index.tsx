/** @module Components.Project.View */

import { Dispatch, useCallback, useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import {
  Tanatloc3DPart,
  Tanatloc3DSelectionPoint,
  Tanatloc3DSelectionValue
} from '@airthium/tanatloc-3d'
import { v4 } from 'uuid'

import {
  IFrontGeometriesItem,
  IFrontProject,
  IFrontSimulationsItem,
  IFrontResult
} from '@/api/index.d'

import useCustomEffect from '@/components/utils/useCustomEffect'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'
import { SelectContext } from '@/context/select'
import {
  highlight,
  select,
  setData,
  setPoint,
  setPostProcessing
} from '@/context/select/actions'

import { IGeometryPart } from '@/lib/index.d'

import SimulationAPI from '@/api/simulation'
import AvatarAPI from '@/api/avatar'
import GeometryAPI from '@/api/geometry'
import ResultAPI from '@/api/result'

import style from './index.module.css'

import theme from '@/styles/theme'

const Renderer = dynamic(
  () => import('@airthium/tanatloc-3d').then((mod) => mod.default.Renderer),
  { ssr: false }
)

// Local interfaces
export interface TGeometry
  extends Pick<IFrontGeometriesItem, 'id' | 'needCleanup'> {
  visible?: boolean
}

export interface TResult
  extends Pick<IFrontResult, 'name' | 'glb' | 'originPath' | 'extra'> {}

/**
 * Props
 */
export interface IProps {
  project: Pick<IFrontProject, 'id' | 'title'>
  simulation?: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  geometries: TGeometry[]
  results: TResult[]
  postprocessing?: TResult
}

/**
 * Errors
 */
export const errors = {
  part: 'Unable to load part',
  snapshot: 'Unable to save snapshot'
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
  type: 'geometry' | 'result',
  dispatch: Dispatch<INotificationAction>
): Promise<IGeometryPart> => {
  try {
    if (type === 'geometry') {
      const geometry = file as Pick<IFrontGeometriesItem, 'id'>
      const part = await GeometryAPI.getPart({ id: geometry.id })
      return { ...part, extra: { id: geometry.id } }
    } else {
      const result = file as Pick<
        IFrontResult,
        'name' | 'glb' | 'originPath' | 'extra'
      >
      const part = await ResultAPI.load(
        { id: simulation!.id },
        { originPath: result.originPath, glb: result.glb! }
      )
      return {
        ...part,
        extra: {
          name: result.name,
          glb: result.glb,
          fields: result.extra
        }
      }
    }
  } catch (err: any) {
    dispatch(addError({ title: errors.part, err }))
    throw err
  }
}

/**
 * Load result
 * @param simulation Simulation
 * @param parts Parts
 * @param results Results
 * @returns Result
 */
export const _loadResults = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  parts: IGeometryPart[],
  results: TResult[],
  dispatch: Dispatch<INotificationAction>
): Promise<IGeometryPart[]> => {
  const partsContent = []
  for (const result of results) {
    const prevPart = parts.find((part) => part.extra?.glb === result.glb)
    if (prevPart) {
      partsContent.push(prevPart)
      continue
    }

    const partContent = await _loadPart(simulation, result, 'result', dispatch)
    partsContent.push(partContent)
  }

  return partsContent
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
  dispatch: Dispatch<INotificationAction>,
  postprocessing?: TResult
): Promise<IGeometryPart | undefined> => {
  if (!postprocessing) return

  const prevPart = parts.find((part) => part.extra?.glb === postprocessing.glb)
  if (prevPart) return prevPart

  const partContent = await _loadPart(
    simulation,
    postprocessing,
    'result',
    dispatch
  )
  return partContent
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
  geometries: TGeometry[],
  dispatch: Dispatch<INotificationAction>
): Promise<IGeometryPart[]> => {
  const partsContent = []
  for (const geometry of geometries) {
    const prevPart = parts.find((part) => part.extra?.id === geometry.id)
    if (prevPart) {
      partsContent.push(prevPart)
      continue
    }

    const partContent = await _loadPart(
      simulation,
      geometry,
      'geometry',
      dispatch
    )
    partsContent.push(partContent)
  }

  return partsContent
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
  results,
  postprocessing
}: IProps): React.JSX.Element => {
  // State
  const [parts, setParts] = useState<IGeometryPart[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [dataEnabled, setDataEnabled] = useState<boolean>(false)
  const [postProcessingEnabled, setPostProcessingEnabled] =
    useState<boolean>(false)

  // Context
  const { enabled, part, highlighted, selected, point, type, dispatch } =
    useContext(SelectContext)
  const { dispatch: notificationDispatch } = useContext(NotificationContext)

  // Data
  const [currentSimulation] = SimulationAPI.useSimulation(simulation?.id)

  // Parts
  useCustomEffect(() => {
    const load = async () => {
      setLoading(true)

      const newParts = []

      // Results
      if (simulation && !postprocessing) {
        const newResults = await _loadResults(
          simulation,
          parts,
          results,
          notificationDispatch
        )
        newParts.push(...newResults)
      }

      // Postprocessing
      if (simulation) {
        const newPostprocessing = await _loadPostprocessing(
          simulation,
          parts,
          notificationDispatch,
          postprocessing
        )
        newPostprocessing && newParts.push(newPostprocessing)
      }

      // Geometries
      if (!results.length && !postprocessing) {
        const newGeometries = await _loadGeometries(
          simulation,
          parts,
          geometries,
          notificationDispatch
        )
        newParts.push(...newGeometries)
      }

      setParts(newParts)
    }

    load()
      .catch((_err) => {
        setLoading(false)
      })
      .finally(() => setLoading(false))
  }, [
    simulation,
    geometries,
    results,
    postprocessing,
    parts,
    notificationDispatch
  ])

  // Data enabled
  useEffect(() => {
    const tasks = currentSimulation.tasks
    const datas = tasks
      ?.map((task) => task.datas)
      .filter((d) => d)
      .flat()

    if (datas?.length) setDataEnabled(true)
    else setDataEnabled(false)
  }, [currentSimulation])

  // Postprocessing enabled
  useEffect(() => {
    if (simulation?.scheme.configuration.run.postprocessing) {
      let oneResult = false
      parts.forEach((part) => {
        if (part.summary.type === 'result') oneResult = true
      })

      if (oneResult) setPostProcessingEnabled(true)
      else setPostProcessingEnabled(false)
    } else setPostProcessingEnabled(false)
  }, [simulation, parts])

  /**
   * Snapshot
   * @param image Image
   */
  const snapshot = useCallback(
    async (image: string): Promise<void> => {
      try {
        await AvatarAPI.add(
          {
            name: 'snapshot',
            uid: 'snapshot_' + v4(),
            data: image
          },
          { id: project.id }
        )
      } catch (err: any) {
        notificationDispatch(addError({ title: errors.snapshot, err }))
      }
    },
    [project.id, notificationDispatch]
  )

  /**
   * On highlight
   * @param value Value
   */
  const onHighlight = useCallback(
    (value?: Tanatloc3DSelectionValue) => {
      dispatch(highlight(value))
    },
    [dispatch]
  )

  /**
   * On select
   * @param value Value
   */
  const onSelect = useCallback(
    (value: Tanatloc3DSelectionValue[]) => {
      dispatch(select(value))
    },
    [dispatch]
  )

  /**
   * On point
   * @param value Value
   */
  const onPoint = useCallback(
    (value: Tanatloc3DSelectionPoint) => {
      dispatch(setPoint(value))
    },
    [dispatch]
  )

  /**
   * On data
   */
  const onData = useCallback(() => {
    dispatch(setData(true))
  }, [dispatch])

  /**
   * On postprocessing
   */
  const onPostProcessing = useCallback(() => {
    dispatch(setPostProcessing(true))
  }, [dispatch])

  /**
   * Render
   */
  return (
    <>
      <div
        style={{ display: loading ? 'flex' : 'none' }}
        className={style.loading}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />} />
      </div>
      <Renderer
        theme={theme}
        style={{ width: 'calc(100vw - 256px)' }}
        parts={parts as Tanatloc3DPart[]}
        selection={{
          enabled,
          part,
          type,
          highlighted,
          selected,
          point,
          onHighlight,
          onSelect,
          onPoint
        }}
        data={dataEnabled}
        postProcessing={postProcessingEnabled}
        snapshot={{
          project: {
            apiRoute: snapshot,
            size: { width: 2 * 260, height: 2 * 156 }
          }
        }}
        onData={onData}
        onPostProcessing={onPostProcessing}
      />
    </>
  )
}

export default View
