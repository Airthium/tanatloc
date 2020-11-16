import { useState, useEffect } from 'react'
import {
  Alert,
  Button,
  Card,
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

import { update, useSimulations } from '../../../../../src/api/simulation'
import { get } from '../../../../../src/api/file'

const Geometry = ({ project, simulation, part }) => {
  // State
  const [upload, setUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentFile, setCurrentFile] = useState()

  console.log(part)

  // Data
  const [, { mutateOneSimulation }] = useSimulations(project?.simulations)

  // Effect
  useEffect(() => {
    const file = simulation?.scheme.categories.geometry.file
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
          buffer: Buffer.from(buffer)
        },
        done: true
      }

      // Update simulation
      await update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'diff',
          path: ['categories', 'geometry'],
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

      setLoading(false)
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

    // Update simulation
    await update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'diff',
        path: ['categories', 'geometry'],
        value: diff
      }
    ])

    // Mutate
    mutateOneSimulation({
      ...simulation,
      scheme: {
        ...simulation.scheme,
        categories: {
          ...simulation.scheme.categories,
          geometry: {
            ...simulation.scheme.categories.geometry,
            file: undefined,
            done: false
          }
        }
      }
    })
  }

  const onDownload = async () => {
    const file = {
      origin: simulation.scheme.categories.geometry.file.origin,
      originPath: simulation.scheme.categories.geometry.file.originPath
    }
    const content = await get({ id: simulation.id }, file)

    const data = new File([Buffer.from(content.buffer).toString()], file.origin)
    const url = window.URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', file.origin)
    link.click()
    link.remove()
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
                    description="Unable to load part TODO Franck"
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
