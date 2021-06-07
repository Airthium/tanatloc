import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Divider, Layout, Space, Typography } from 'antd'

import Add from './add'
import Edit from './edit'

import Loading from '@/components/loading'
import {
  DeleteButton,
  DownloadButton,
  EditButton
} from '@/components/assets/button'
import { Error as ErrorNotification } from '@/components/assets/notification'

import GeometryAPI from '@/api/geometry'

/**
 * Errors simulation/geometry
 * @memberof module:components/project/simulation
 */
const errors = {
  downloadError: 'Unable to download geometry',
  updateError: 'Unable to update geometry',
  delError: 'Unable to delete geometry'
}

/**
 * Geometry
 * @memberof module:components/project/simulation
 * @param {Object} props Props
 */
const Geometry = ({ project, geometry, swr, close }) => {
  // State
  const [downloading, setDownloading] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Loading
  useEffect(() => {
    window.MathJax?.typeset()
  }, [geometry])

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
      const index = project.geometries.findIndex((g) => g.id === geometry.id)
      swr.mutateProject({
        geometries: [
          ...project.geometries.slice(0, index),
          geometry,
          ...project.geometries.slice(index + 1)
        ]
      })
    } catch (err) {
      ErrorNotification(errors.updateError, err)
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
        (g) => g.id !== geometry.id
      )
      swr.mutateProject({
        projects: filteredGeometries
      })
      swr.delOneGeometry(geometry)

      // Close
      close()
    } catch (err) {
      ErrorNotification(errors.delError, err)
    } finally {
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
          <Space direction="vertical">
            <Typography.Title level={5}>Informations</Typography.Title>
            <Typography.Text>File: {geometry.name} </Typography.Text>
            <Typography.Text>Unit: \(m\)</Typography.Text>
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

            <Divider type="horizontal" />

            <Space
              direction=""
              style={{ width: '100%', justifyContent: 'space-around' }}
            >
              <DownloadButton loading={downloading} onDownload={onDownload} />
              <Edit
                visible={editVisible}
                geometry={geometry}
                setVisible={setEditVisible}
                onEdit={onEdit}
              />
              <EditButton onEdit={() => setEditVisible(true)} />
              <DeleteButton
                loading={deleting}
                text="Are you sure to delete this geometry?"
                onDelete={onDelete}
              />
            </Space>
          </Space>
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
