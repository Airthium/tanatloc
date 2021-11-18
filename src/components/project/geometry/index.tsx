/** @namespace Components.Project.Geometry */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Card, Layout, Space, Typography } from 'antd'
import { MathJax } from 'better-react-mathjax'

import Loading from '@/components/loading'
import {
  DeleteButton,
  DownloadButton,
  EditButton
} from '@/components/assets/button'
import { Error as ErrorNotification } from '@/components/assets/notification'

import Add from './add'
import Edit from './edit'

import GeometryAPI from '@/api/geometry'

/**
 * Errors
 * @memberof Components.Project.Geometry
 */
const errors = {
  downloadError: 'Unable to download geometry',
  updateError: 'Unable to update geometry',
  delError: 'Unable to delete geometry'
}

/**
 * Geometry
 * @memberof Components.Project.Geometry
 * @param {Object} props Props `{ project, geometry, swr, close }`
 */
const Geometry = ({ project, geometry, swr, close }) => {
  // State
  const [downloading, setDownloading] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)

  /**
   * On download
   */
  const onDownload = async () => {
    setDownloading(true)

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
      ErrorNotification(errors.downloadError, err)
    } finally {
      setDownloading(false)
    }
  }

  /**
   * On edit
   */
  const onEdit = async ({ name }) => {
    try {
      // API
      await GeometryAPI.update({ id: geometry.id }, [
        {
          key: 'name',
          value: name
        }
      ])

      // Local
      geometry.name = name
      swr.mutateOneGeometry(geometry)
    } catch (err) {
      ErrorNotification(errors.updateError, err)
      throw err
    }
  }

  /**
   * On delete
   */
  const onDelete = async () => {
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
                    name: geometry?.name
                  }}
                  setVisible={setEditVisible}
                  onEdit={onEdit}
                />
                <EditButton onEdit={() => setEditVisible(true)} />
              </div>,
              <DeleteButton
                key="delete"
                loading={deleting}
                text="Are you sure to delete this geometry?"
                onDelete={onDelete}
              />
            ]}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Typography.Text>File: {geometry.name} </Typography.Text>
              <Typography.Text>
                Unit:{' '}
                <MathJax inline dynamic>
                  $m$
                </MathJax>
              </Typography.Text>
              {geometry.summary ? (
                <>
                  {geometry.summary.solids && (
                    <Typography.Text>
                      Number of solids: {geometry.summary.solids.length}
                    </Typography.Text>
                  )}
                  {geometry.summary.faces && (
                    <Typography.Text>
                      Number of faces: {geometry.summary.faces.length}
                    </Typography.Text>
                  )}
                  {geometry.summary.edges && (
                    <Typography.Text>
                      Number of edges: {geometry.summary.edges.length}
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
