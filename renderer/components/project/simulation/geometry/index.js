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
  Upload
} from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  LoadingOutlined,
  PlusOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'

import SimulationAPI from '../../../../../src/api/simulation'
import FileAPI from '../../../../../src/api/file'

import Sentry from '../../../../../src/lib/sentry'

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
        message.error(errors.updateError)
        console.error(err)
        Sentry.captureException(err)
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
      message.error(errors.updateError)
      console.error(err)
      Sentry.captureException(err)
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
      message.error(errors.downloadError)
      console.error(err)
      Sentry.captureException(err)
    }
  }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        {upload ? (
          <>
            <p>
              <b>Upload a geometry</b>
            </p>
            <p>STEP (3D) of DXF (2D) file</p>
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
          </>
        ) : (
          <>
            <Card title="Informations">
              <p>
                <b>File:</b> {currentFile?.name}{' '}
              </p>

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
                      <p>
                        <b>Number of solids:</b> {part.solids?.length}
                      </p>
                    )}
                    {part.faces && (
                      <p>
                        <b>Number of faces:</b> {part.faces?.length}
                      </p>
                    )}
                    {part.edges && (
                      <p>
                        <b>Number of edges:</b> {part.edges?.length}
                      </p>
                    )}
                  </>
                )
              ) : (
                <Spin />
              )}
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
