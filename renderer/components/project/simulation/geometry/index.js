import { useState, useEffect } from 'react'
import {
  message,
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
  PlusOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'

import { Error } from '../../../assets/notification'

import SimulationAPI from '../../../../../src/api/simulation'
import FileAPI from '../../../../../src/api/file'

/**
 * Errors simulation/geometry
 * @memberof module:renderer/components/project/simulation
 */
const errors = {
  updateError: 'Unable to update the simulation',
  downloadError: 'Unable to download the file',
  UNABLE_TO_LOAD: 'Unable to load geometry'
}

/**
 * Geometry
 * @memberof module:renderer/components/project/simulation
 * @param {Object} props Props
 */
const Geometry = ({ project, simulation, part }) => {
  // State
  const [upload, setUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentFile, setCurrentFile] = useState()

  // Data
  const [, { mutateOneSimulation }] = SimulationAPI.useSimulations(
    project?.simulations
  )

  // Effect
  useEffect(() => {
    const file = simulation?.scheme.configuration.geometry.file
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
    const goodFormat =
      file.name.toLowerCase().includes('.stp') ||
      file.name.toLowerCase().includes('.step') ||
      file.name.toLowerCase().includes('.dxf')
    return goodFormat
  }

  /**
   * On upload
   * @param {object} info Info
   */
  const onChange = async (info) => {
    if (info.file.status === 'uploading') setLoading(true)

    if (info.file.status === 'done') {
      const buffer = await getFile(info.file.originFileObj)

      // Diff scheme
      const diff = {
        file: {
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
            method: 'diff',
            path: ['configuration', 'geometry'],
            value: diff
          }
        ])

        // Mutate simulation
        mutateOneSimulation(
          {
            ...simulation
          },
          true
        )
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
    const buffer = await new Promise((resolve) => {
      reader.addEventListener('load', () => {
        resolve(reader.result)
      })
      reader.readAsArrayBuffer(file)
    })
    return buffer
  }

  /**
   * On delete
   */
  const onDelete = async () => {
    // Diff scheme
    const diff = {
      file: 'remove',
      done: false
    }

    try {
      // Update simulation
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'diff',
          path: ['configuration', 'geometry'],
          value: diff
        }
      ])

      // Mutate
      mutateOneSimulation({
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
    }
  }

  const onDownload = async () => {
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
    }
  }

  useEffect(() => {
    window.MathJax?.typeset()
  }, [])

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        {upload ? (
          <Space direction="vertical">
            <Typography.Text>
              <b>Upload a geometry</b>
            </Typography.Text>
            <Typography.Text>STEP (3D) of DXF (2D) file</Typography.Text>
            <Upload
              accept=".stp,.step,.dxf"
              showUploadList={false}
              listType="picture-card"
              beforeUpload={beforeUpload}
              onChange={onChange}
            >
              <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Space>
        ) : (
          <>
            <Card title="Informations">
              <Space direction="vertical">
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
              </Space>
            </Card>
            <Space style={{ marginTop: '10px' }}>
              <Button icon={<DownloadOutlined />} onClick={onDownload} />
              <Popconfirm
                title="Are you sure"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={onDelete}
              >
                <Button type="danger" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          </>
        )}
      </Layout.Content>
    </Layout>
  )
}

export default Geometry
