import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import {
  Alert,
  Button,
  Collapse,
  Divider,
  Layout,
  Space,
  Spin,
  Typography,
  Upload
} from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  LoadingOutlined,
  UploadOutlined
} from '@ant-design/icons'

import Add from './add'

import Loading from '@/components/loading'
import { DeleteDialog } from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

// import SimulationAPI from '@/api/simulation'
// import FileAPI from '@/api/file'

/**
 * Errors simulation/geometry
 * @memberof module:components/project/simulation
 */
const errors = {
  updateError: 'Unable to update the simulation',
  downloadError: 'Unable to download the file',
  UNABLE_TO_LOAD: 'Unable to load geometry'
}

/**
 * Geometry
 * @memberof module:components/project/simulation
 * @param {Object} props Props
 */
const Geometry = ({ geometry, part, swr }) => {
  // State
  const [loading, setLoading] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // Units LaTeX
  useEffect(() => {}, [part])

  // Loading
  useEffect(() => {
    if (!geometry) setLoading(true)
    else {
      setLoading(false)
      window.MathJax?.typeset()
    }
  }, [geometry])

  /**
   * On delete
   */
  const onDelete = async () => {
    // setDeleting(true)
    // // Diff scheme
    // const diff = {
    //   ...simulation.scheme.configuration.geometry,
    //   file: 'remove',
    //   done: false
    // }
    // try {
    //   // API
    //   await SimulationAPI.update({ id: simulation.id }, [
    //     {
    //       key: 'scheme',
    //       type: 'json',
    //       method: 'set',
    //       path: ['configuration', 'geometry'],
    //       value: diff
    //     }
    //   ])
    //   // Local
    //   swr.mutateOneSimulation({
    //     ...simulation,
    //     scheme: {
    //       ...simulation.scheme,
    //       configuration: {
    //         ...simulation.scheme.configuration,
    //         geometry: {
    //           ...simulation.scheme.configuration.geometry,
    //           file: undefined,
    //           done: false
    //         }
    //       }
    //     }
    //   })
    // } catch (err) {
    //   Error(errors.updateError, err)
    // } finally {
    //   setDeleting(false)
    //   setDeleteVisible(false)
    // }
  }

  /**
   * On download
   */
  const onDownload = async () => {
    // setDownloading(true)
    // const file = {
    //   origin: simulation.scheme.configuration.geometry.file.origin,
    //   originPath: simulation.scheme.configuration.geometry.file.originPath
    // }
    // try {
    //   const content = await FileAPI.get({ id: simulation.id }, file)
    //   const data = new File(
    //     [Buffer.from(content.buffer).toString()],
    //     file.origin
    //   )
    //   const url = window.URL.createObjectURL(data)
    //   const link = document.createElement('a')
    //   link.href = url
    //   link.setAttribute('download', file.origin)
    //   link.click()
    //   link.remove()
    // } catch (err) {
    //   Error(errors.downloadError, err)
    // } finally {
    //   setDownloading(false)
    // }
  }

  /**
   * Render
   */
  if (loading) return <Loading.Simple />
  else
    return (
      <Layout>
        <Layout.Content>
          <Space direction="vertical">
            <Typography.Title level={5}>Informations</Typography.Title>
            <Typography.Text>
              <b>File:</b> {geometry.name}{' '}
            </Typography.Text>
            <Typography.Text>
              <b>Unit:</b> \(m\)
            </Typography.Text>
            {geometry.summary ? (
              <>
                {geometry.summary.solids && (
                  <Typography.Text>
                    <b>Number of solids:</b> {geometry.summary.solids.length}
                  </Typography.Text>
                )}
                {geometry.summary.faces && (
                  <Typography.Text>
                    <b>Number of faces:</b> {geometry.summary.faces.length}
                  </Typography.Text>
                )}
                {geometry.summary.edges && (
                  <Typography.Text>
                    <b>Number of edges:</b> {geometry.summary.edges.length}
                  </Typography.Text>
                )}
              </>
            ) : (
              <Typography.Text>No summary available</Typography.Text>
            )}

            <div style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                loading={downloading}
                onClick={onDownload}
              />
            </div>

            <Divider type="horizontal" />

            <DeleteDialog
              visible={deleteVisible}
              onCancel={() => setDeleteVisible(false)}
              onOk={onDelete}
              loading={deleting}
            >
              Are you sure delete this geometry?
            </DeleteDialog>
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              onClick={() => setDeleteVisible(true)}
            >
              Delete geometry
            </Button>
          </Space>
        </Layout.Content>
      </Layout>
    )
}

// Geometry.propTypes = {
//   simulation: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     scheme: PropTypes.shape({
//       configuration: PropTypes.shape({
//         geometry: PropTypes.shape({
//           file: PropTypes.shape({
//             glb: PropTypes.string.isRequired,
//             originPath: PropTypes.string.isRequired
//           })
//         }).isRequired
//       }).isRequired
//     }).isRequired
//   }).isRequired,
//   part: PropTypes.shape({
//     error: PropTypes.bool,
//     message: PropTypes.string,
//     solids: PropTypes.array,
//     faces: PropTypes.array,
//     edges: PropTypes.array
//   }),
//   swr: PropTypes.shape({
//     mutateOneSimulation: PropTypes.func.isRequired
//   }).isRequired
// }

Geometry.Add = Add
export default Geometry
