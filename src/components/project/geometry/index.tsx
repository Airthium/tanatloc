/** @module Components.Project.Geometry */

import { useCallback, useState } from 'react'
import { Card, Layout, Space, Typography } from 'antd'

import {
  IFrontGeometriesItem,
  IFrontMutateGeometriesItem,
  IFrontProject
} from '@/api/index.d'

import Loading from '@/components/loading'

import {
  DeleteButton,
  DownloadButton,
  EditButton
} from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'
import MathJax from '@/components/assets/mathjax'

import GeometryAPI from '@/api/geometry'

import Add from './add'
import Edit from './edit'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  project: Pick<IFrontProject, 'id' | 'geometries'>
  geometry?: Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>
  swr: {
    mutateProject: (project: Partial<IFrontProject>) => void
    mutateOneGeometry: (geometry: IFrontMutateGeometriesItem) => void
    delOneGeometry: (geometry: IFrontMutateGeometriesItem) => void
  }
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
export const _onDownload = async (
  geometry: Pick<IFrontGeometriesItem, 'id' | 'name'>
): Promise<void> => {
  try {
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
  } catch (err) {
    ErrorNotification(errors.download, err)
  }
}

/**
 * On edit
 * @param geometry Geometry
 * @param values Values
 * @param swr SWR
 */
export const _onEdit = async (
  geometry: Pick<IFrontGeometriesItem, 'id' | 'name'>,
  values: { name: string },
  swr: {
    mutateOneGeometry: (geometry: IFrontMutateGeometriesItem) => void
  }
): Promise<void> => {
  try {
    // API
    await GeometryAPI.update({ id: geometry.id }, [
      {
        key: 'name',
        value: values.name
      }
    ])

    // Local
    geometry.name = values.name
    swr.mutateOneGeometry(geometry)
  } catch (err) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * On delete
 * @param geometry Geometry
 * @param project Project
 * @param close Close
 * @param swr SWR
 */
export const _onDelete = async (
  geometry: Pick<IFrontGeometriesItem, 'id'>,
  project: Pick<IFrontProject, 'id' | 'geometries'>,
  close: () => void,
  swr: {
    mutateProject: (project: Partial<IFrontProject>) => void
    delOneGeometry: (geometry: IFrontMutateGeometriesItem) => void
  }
): Promise<void> => {
  try {
    // API
    await GeometryAPI.del({ id: geometry.id })

    // Local
    const filteredGeometries = project.geometries.filter(
      (g) => g !== geometry.id
    )
    swr.mutateProject({
      id: project.id,
      geometries: filteredGeometries
    })
    swr.delOneGeometry(geometry)

    // Close
    close()
  } catch (err) {
    ErrorNotification(errors.del, err)
    throw err
  }
}

/**
 * Geometry
 * @param props Props
 * @returns Geometry
 */
const Geometry = ({
  project,
  geometry,
  swr,
  close,
  onCleanup
}: IProps): JSX.Element => {
  // State
  const [downloading, setDownloading] = useState<boolean>(false)
  const [editVisible, setEditVisible] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)

  /**
   * Set edit visible true
   */
  const setEditVisibleTrue = useCallback(() => setEditVisible(true), [])

  /**
   * On download
   */
  const onDownload = useCallback(async () => {
    setDownloading(true)
    try {
      await _onDownload(geometry!)
    } catch (err) {
    } finally {
      setDownloading(false)
    }
  }, [geometry])

  /**
   * On edit
   * @param value Value
   */
  const onEdit = useCallback(
    async (value: { name: string }) => _onEdit(geometry!, value, swr),
    [geometry, swr]
  )

  /**
   * On delete
   */
  const onDelete = useCallback(async () => {
    setDeleting(true)
    try {
      await _onDelete(geometry!, project, close, swr)
      onCleanup(geometry!.id)
    } finally {
      setDeleting(false)
    }
  }, [project, geometry, swr, close, onCleanup])

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

Geometry.componentName = 'Geometry'
Geometry.Add = Add
export default Geometry
