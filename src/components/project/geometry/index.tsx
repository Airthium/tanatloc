/** @module Components.Project.Geometry */

import { useState } from 'react'
import { Card, Layout, Space, Typography } from 'antd'

import Loading from '@/components/loading'
import {
  DeleteButton,
  DownloadButton,
  EditButton
} from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'
import MathJax from '@/components/assets/mathjax'

import {
  IFrontGeometriesItem,
  IFrontMutateGeometriesItem,
  IFrontProject
} from '@/api/index.d'
import GeometryAPI from '@/api/geometry'

import Add from './add'
import Edit from './edit'

/**
 * Props
 */
export interface IProps {
  project: Pick<IFrontProject, 'id' | 'geometries'>
  geometry: Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>
  swr: {
    mutateProject: (project: Partial<IFrontProject>) => void
    mutateOneGeometry: (geometry: IFrontMutateGeometriesItem) => void
    delOneGeometry: (geometry: IFrontMutateGeometriesItem) => void
  }
  close: () => void
  onCleanup: () => void
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
export const onDownload = async (
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
export const onEdit = async (
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
export const onDelete = async (
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
              onDownload={async () => {
                setDownloading(true)
                try {
                  await onDownload(geometry)
                } catch (err) {
                } finally {
                  setDownloading(false)
                }
              }}
            />,
            <div key="edit">
              <Edit
                visible={editVisible}
                geometry={{
                  id: geometry?.id,
                  name: geometry?.name
                }}
                setVisible={setEditVisible}
                onEdit={async (value: { name: string }) =>
                  onEdit(geometry, value, swr)
                }
              />
              <EditButton onEdit={() => setEditVisible(true)} />
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
              onDelete={async () => {
                setDeleting(true)
                try {
                  await onDelete(geometry, project, close, swr)
                  onCleanup()
                } finally {
                  setDeleting(false)
                }
              }}
            />
          ]}
        >
          <Space direction="vertical" className="full-width">
            <Typography.Text>
              <span className="text-light">File:</span> {geometry.name}{' '}
            </Typography.Text>
            <Typography.Text>
              <span className="text-light">Unit:</span>{' '}
              <MathJax.Inline text={'m'} />
            </Typography.Text>
            {geometry.summary ? (
              <>
                {geometry.summary.solids && (
                  <Typography.Text>
                    <span className="text-light">Number of solids:</span>{' '}
                    {geometry.summary.solids.length}
                  </Typography.Text>
                )}
                {geometry.summary.faces && (
                  <Typography.Text>
                    <span className="text-light">Number of faces:</span>{' '}
                    {geometry.summary.faces.length}
                  </Typography.Text>
                )}
                {geometry.summary.edges && (
                  <Typography.Text>
                    <span className="text-light">Number of edges:</span>{' '}
                    {geometry.summary.edges.length}
                  </Typography.Text>
                )}
              </>
            ) : (
              <Typography.Text>No summary available</Typography.Text>
            )}
          </Space>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

Geometry.Add = Add
export default Geometry
