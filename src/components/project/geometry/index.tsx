/** @module Components.Project.Geometry */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Card, Layout, Space, Typography } from 'antd'

import { IGeometry } from '@/database/index.d'
import { IProjectWithData } from '@/lib/index.d'

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

export interface IProps {
  project: IProjectWithData
  geometry: IGeometry
  swr: {
    mutateProject: Function
    mutateOneGeometry: Function
    delOneGeometry: Function
  }
  close: Function
}

/**
 * Errors
 */
const errors = {
  downloadError: 'Unable to download geometry',
  updateError: 'Unable to update geometry',
  delError: 'Unable to delete geometry'
}

/**
 * On download
 */
const onDownload = async (geometry: IGeometry): Promise<void> => {
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
    ErrorNotification(errors.updateError, err)
  }
}

/**
 * On edit
 */
const onEdit = async (
  value: { name: string },
  geometry: IGeometry,
  swr: IProps['swr']
): Promise<void> => {
  try {
    // API
    await GeometryAPI.update({ id: geometry.id }, [
      {
        key: 'name',
        value: value.name
      }
    ])

    // Local
    geometry.name = value.name
    swr.mutateOneGeometry(geometry)
  } catch (err) {
    ErrorNotification(errors.updateError, err)
    throw err
  }
}

/**
 * Geometry
 * @param props Props
 */
const Geometry = ({ project, geometry, swr, close }: IProps): JSX.Element => {
  // State
  const [downloading, setDownloading]: [boolean, Function] = useState(false)
  const [editVisible, setEditVisible]: [boolean, Function] = useState(false)
  const [deleting, setDeleting]: [boolean, Function] = useState(false)

  /**
   * On delete
   */
  const onDelete = async (): Promise<void> => {
    setDeleting(true)

    try {
      // API
      await GeometryAPI.del({ id: geometry.id })

      // Local
      const filteredGeometries = project.geometries.filter(
        (g) => g !== geometry.id
      )
      swr.mutateProject({
        geometries: filteredGeometries
      })
      swr.delOneGeometry(geometry)

      // Close
      close()
    } catch (err) {
      ErrorNotification(errors.delError, err)
      setDeleting(false)
    }
  }

  /**
   * Render
   */
  if (!geometry) return <Loading.Simple />
  else
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
                onDownload={() => {
                  setDownloading(true)
                  try {
                    onDownload(geometry)
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
                  onEdit={(value: { name: string }) => {
                    try {
                      onEdit(value, geometry, swr)
                    } catch (err) {}
                  }}
                />
                <EditButton onEdit={() => setEditVisible(true)} />
              </div>,
              <DeleteButton
                key="delete"
                loading={deleting}
                text="Are you sure you want to delete this geometry?"
                onDelete={onDelete}
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

Geometry.propTypes = {
  project: PropTypes.exact({
    id: PropTypes.string,
    geometries: PropTypes.array
  }),
  geometry: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    summary: PropTypes.object
  }),
  swr: PropTypes.exact({
    mutateProject: PropTypes.func.isRequired,
    mutateOneGeometry: PropTypes.func.isRequired,
    delOneGeometry: PropTypes.func.isRequired
  }).isRequired,
  close: PropTypes.func.isRequired
}

Geometry.Add = Add
export default Geometry
