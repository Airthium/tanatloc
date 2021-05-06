import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import {
  Alert,
  Button,
  Card,
  Collapse,
  Layout,
  Popconfirm,
  Space,
  Spin,
  Typography,
  Upload
} from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
  UploadOutlined
} from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'
import FileAPI from '@/api/file'

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
const Geometry = ({ simulation, part, swr }) => {
  // State
  const [upload, setUpload] = useState(true)
  const [loading, setLoading] = useState(false)
  const [currentFile, setCurrentFile] = useState()
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // Units LaTeX
  useEffect(() => {
    window.MathJax?.typeset()
  }, [part])

  // Effect
  useEffect(() => {
    const file = simulation.scheme.configuration.geometry.file
    setCurrentFile(file)
    if (file) {
      setUpload(false)
    } else {
      setUpload(true)
    }
  }, [simulation])

  /**
   * Upload check
   * @param {Object} file File
   */
  const beforeUpload = (file) => {
    return (
      file.name.toLowerCase().includes('.stp') ||
      file.name.toLowerCase().includes('.step') ||
      file.name.toLowerCase().includes('.dxf')
    )
  }

  /**
   * On upload
   * @param {object} info Info
   */
  const onUpload = async (info) => {
    if (info.file.status === 'uploading') setLoading(true)

    if (info.file.status === 'done') {
      const buffer = await getFile(info.file.originFileObj)

      // Diff scheme
      const diff = {
        ...simulation.scheme.configuration.geometry,
        file: {
          type: 'geometry',
          name: info.file.name,
          uid: info.file.uid,
          buffer: Buffer.from(buffer)
        },
        done: true
      }

      try {
        // Update simulation
        await SimulationAPI.update({ id: simulation.id }, [
          {
            key: 'scheme',
            type: 'json',
            method: 'set',
            path: ['configuration', 'geometry'],
            value: diff
          }
        ])

        // Mutate simulation
        swr.mutateOneSimulation({ ...simulation }, true)
      } catch (err) {
        Error(errors.updateError, err)
      } finally {
        setLoading(false)
      }
    }
  }

  /**
   * Get file
   * @param {Object} file File
   */
  const getFile = async (file) => {
    const reader = new FileReader()
    return new Promise((resolve) => {
      reader.addEventListener('load', () => {
        resolve(reader.result)
      })
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * On delete
   */
  const onDelete = async () => {
    setDeleting(true)

    // Diff scheme
    const diff = {
      ...simulation.scheme.configuration.geometry,
      file: 'remove',
      done: false
    }

    try {
      // API
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'set',
          path: ['configuration', 'geometry'],
          value: diff
        }
      ])

      // Local
      swr.mutateOneSimulation({
        ...simulation,
        scheme: {
          ...simulation.scheme,
          configuration: {
            ...simulation.scheme.configuration,
            geometry: {
              ...simulation.scheme.configuration.geometry,
              file: undefined,
              done: false
            }
          }
        }
      })
    } catch (err) {
      Error(errors.updateError, err)
    } finally {
      setDeleting(false)
      setDeleteVisible(false)
    }
  }

  /**
   * On download
   */
  const onDownload = async () => {
    setDownloading(true)

    const file = {
      origin: simulation.scheme.configuration.geometry.file.origin,
      originPath: simulation.scheme.configuration.geometry.file.originPath
    }

    try {
      const content = await FileAPI.get({ id: simulation.id }, file)

      const data = new File(
        [Buffer.from(content.buffer).toString()],
        file.origin
      )
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', file.origin)
      link.click()
      link.remove()
    } catch (err) {
      Error(errors.downloadError, err)
    } finally {
      setDownloading(false)
    }
  }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        {upload ? (
          <Space direction="vertical">
            <Typography.Title level={5}>
              <b>Upload a geometry</b>
            </Typography.Title>
            <Typography.Text>STEP (3D) of DXF (2D) file</Typography.Text>
            <Upload
              className="upload"
              accept=".stp,.step,.dxf"
              showUploadList={false}
              listType="picture-card"
              beforeUpload={beforeUpload}
              onChange={onUpload}
            >
              <div>
                {loading ? (
                  <LoadingOutlined style={{ fontSize: 25 }} />
                ) : (
                  <>
                    <UploadOutlined style={{ fontSize: 25 }} />
                    <div style={{ marginTop: 8 }}>
                      <b>Choose a file</b> or drap it here
                    </div>
                  </>
                )}
              </div>
            </Upload>
          </Space>
        ) : (
          <Space direction="vertical">
            <Typography.Title level={5}>Informations</Typography.Title>
            <Typography.Text>
              <b>File:</b> {currentFile?.name}{' '}
            </Typography.Text>
            <Typography.Text>
              <b>Unit:</b> \(m\)
            </Typography.Text>
            {part ? (
              part.error ? (
                <Alert
                  message="Error"
                  description={
                    <>
                      {errors.UNABLE_TO_LOAD}
                      <Collapse ghost={true}>
                        <Collapse.Panel header="Error">
                          {part.message}
                        </Collapse.Panel>
                      </Collapse>
                    </>
                  }
                  type="error"
                />
              ) : (
                <>
                  {part.solids && (
                    <Typography.Text>
                      <b>Number of solids:</b> {part.solids?.length}
                    </Typography.Text>
                  )}
                  {part.faces && (
                    <Typography.Text>
                      <b>Number of faces:</b> {part.faces?.length}
                    </Typography.Text>
                  )}
                  {part.edges && (
                    <Typography.Text>
                      <b>Number of edges:</b> {part.edges?.length}
                    </Typography.Text>
                  )}
                </>
              )
            ) : (
              <Spin />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <DeleteDialog
                title=""
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
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                loading={downloading}
                onClick={onDownload}
              />
            </div>
          </Space>
        )}
      </Layout.Content>
    </Layout>
  )
}

Geometry.propTypes = {
  simulation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        geometry: PropTypes.shape({
          file: PropTypes.shape({
            origin: PropTypes.string.isRequired,
            originPath: PropTypes.string.isRequired
          })
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  part: PropTypes.shape({
    error: PropTypes.bool,
    message: PropTypes.string,
    solids: PropTypes.array,
    faces: PropTypes.array,
    edges: PropTypes.array
  }),
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default Geometry
