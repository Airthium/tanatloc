/** @module Components.Project.Geometry */

import { useCallback, useContext, useState } from 'react'
import { Card, Layout, Space, Typography } from 'antd'

import {
  IFrontGeometriesItem,
  IFrontMutateGeometriesItem,
  IFrontProject
} from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import Loading from '@/components/loading'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'
import {
  DeleteButton,
  DownloadButton,
  EditButton
} from '@/components/assets/button'
import MathJax from '@/components/assets/mathjax'

import GeometryAPI from '@/api/geometry'

import Edit from './edit'
import Split from './split'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export type Project = Pick<IFrontProject, 'id' | 'geometries'>
export type Geometry = Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>
export type Swr = {
  mutateProject: (project: Partial<IFrontProject>) => Promise<void>
  mutateOneGeometry: (geometry: IFrontMutateGeometriesItem) => Promise<void>
  delOneGeometry: (geometry: IFrontMutateGeometriesItem) => Promise<void>
}
export interface IProps {
  project: Project
  geometry: Geometry | undefined
  swr: Swr
  close: () => void
  onCleanup: (id: string) => void
}

/**
 * Errors
 */
export const errors = {
  download: 'Unable to download geometry',
  update: 'Unable to update geometry',
  del: 'Unable to delete geometry'
}

/**
 * On download
 * @param geometry Geometry
 */
export const _onDownload = async (geometry: Geometry): Promise<void> => {
  const file = await GeometryAPI.download({ id: geometry.id })
  const data = new File(
    [Buffer.from(file.buffer).toString()],
    geometry.name + '.' + file.extension
  )
  const url = window.URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', geometry.name + '.' + file.extension)
  link.click()
  link.remove()
}

/**
 * On edit
 * @param geometry Geometry
 * @param values Values
 * @param swr SWR
 */
export const _onEdit = async (
  geometry: Geometry,
  values: { name: string },
  swr: Pick<Swr, 'mutateOneGeometry'>
): Promise<void> => {
  // API
  await GeometryAPI.update({ id: geometry.id }, [
    {
      key: 'name',
      value: values.name
    }
  ])

  // Local
  geometry.name = values.name
  await swr.mutateOneGeometry(geometry)
}

/**
 * On delete
 * @param geometry Geometry
 * @param project Project
 * @param close Close
 * @param swr SWR
 */
export const _onDelete = async (
  project: Project,
  geometry: Geometry,
  close: () => void,
  swr: Pick<Swr, 'mutateProject' | 'delOneGeometry'>
): Promise<void> => {
  // API
  await GeometryAPI.del({ id: geometry.id })

  // Local
  const filteredGeometries = project.geometries.filter((g) => g !== geometry.id)
  await swr.mutateProject({
    id: project.id,
    geometries: filteredGeometries
  })
  await swr.delOneGeometry(geometry)

  // Close
  close()
}

/**
 * Geometry
 * @param props Props
 * @returns Geometry
 */
const Geometry: React.FunctionComponent<IProps> = ({
  project,
  geometry,
  swr,
  close,
  onCleanup
}) => {
  // State
  const [downloading, setDownloading] = useState<boolean>(false)
  const [editVisible, setEditVisible] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * Set edit visible true
   */
  const setEditVisibleTrue = useCallback(() => setEditVisible(true), [])

  /**
   * On download
   */
  const onDownload = useCallback((): void => {
    asyncFunctionExec(async () => {
      setDownloading(true)
      try {
        await _onDownload(geometry!)
      } catch (err: any) {
        dispatch(addError({ title: errors.download, err }))
      } finally {
        setDownloading(false)
      }
    })
  }, [geometry, dispatch])

  /**
   * On edit
   * @param value Value
   */
  const onEdit = useCallback(
    async (value: { name: string }): Promise<void> => {
      try {
        await _onEdit(geometry!, value, swr)
      } catch (err: any) {
        dispatch(addError({ title: errors.update, err }))
        throw err
      }
    },
    [geometry, swr, dispatch]
  )

  /**
   * On delete
   */
  const onDelete = useCallback(async () => {
    setDeleting(true)
    try {
      await _onDelete(project, geometry!, close, swr)
      onCleanup(geometry!.id)
    } catch (err: any) {
      dispatch(addError({ title: errors.del, err }))
      throw err
    } finally {
      setDeleting(false)
    }
  }, [project, geometry, swr, close, onCleanup, dispatch])

  /**
   * Render
   */
  if (!geometry) return <Loading.Simple />
  return (
    <Layout>
      <Layout.Content>
        <Card
          size="small"
          title="Informations"
          actions={[
            <Split
              project={{ id: project.id }}
              geometry={{ id: geometry.id, summary: geometry.summary }}
              key="split"
            />,
            <DownloadButton
              key="download"
              loading={downloading}
              onDownload={onDownload}
            />,
            <div key="edit">
              <Edit
                visible={editVisible}
                geometry={{
                  id: geometry?.id,
                  name: geometry?.name
                }}
                setVisible={setEditVisible}
                onEdit={onEdit}
              />
              <EditButton onEdit={setEditVisibleTrue} />
            </div>,
            <DeleteButton
              key="delete"
              loading={deleting}
              text={
                <>
                  Are you sure you want to delete the geometry{' '}
                  <Typography.Text strong>{geometry.name}</Typography.Text>?
                </>
              }
              onDelete={onDelete}
            />
          ]}
        >
          <Space direction="vertical" className={globalStyle.fullWidth}>
            <Typography.Text>
              <span className={globalStyle.textLight}>File:</span>{' '}
              {geometry.name}{' '}
            </Typography.Text>
            <Typography.Text>
              <span className={globalStyle.textLight}>Unit:</span>{' '}
              <MathJax.Inline text={'m'} />
            </Typography.Text>

            <>
              {geometry.summary.dimension === 3 && (
                <Typography.Text>
                  <span className={globalStyle.textLight}>
                    Number of solids:
                  </span>{' '}
                  {geometry.summary.solids?.length ?? 0}
                </Typography.Text>
              )}

              <Typography.Text>
                <span className={globalStyle.textLight}>Number of faces:</span>{' '}
                {geometry.summary.faces?.length ?? 0}
              </Typography.Text>

              {geometry.summary.dimension === 2 && (
                <Typography.Text>
                  <span className={globalStyle.textLight}>
                    Number of edges:
                  </span>{' '}
                  {geometry.summary.edges?.length ?? 0}
                </Typography.Text>
              )}
            </>
          </Space>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

export default Geometry
