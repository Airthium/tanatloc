import { useState, useEffect } from 'react'
import { Layout, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

import { update } from '../../../../../src/api/simulation'

const Geometry = ({ simulation }) => {
  const [upload, setUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState()

  useEffect(() => {
    const file = simulation?.scheme.categories.geometry.file
    setFile(file)
    if (file) {
      setUpload(false)
    } else {
      setUpload(true)
    }
  }, [simulation])

  const beforeUpload = (file) => {
    const goodFormat =
      file.name.includes('.stp') ||
      file.name.includes('.step') ||
      file.name.includes('.dxf')
    return goodFormat
  }

  const onChange = async (info) => {
    if (info.file.status === 'uploading') setLoading(true)

    if (info.file.status === 'done') {
      const buffer = await getFile(info.file.originFileObj)

      // Diff scheme
      const diff = {
        file: {
          name: info.file.name,
          buffer: Buffer.from(buffer)
        }
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

      setLoading(false)
    }
  }

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

  return (
    <Layout>
      <Layout.Content>
        {upload ? (
          <>
            <p>Upload a geometry</p>
            <p>(STEP file or DXF file)</p>
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
            <p>{file?.name}</p>
          </>
        )}
      </Layout.Content>
    </Layout>
  )
}

export default Geometry
