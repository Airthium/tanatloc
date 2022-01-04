import PropTypes from 'prop-types'
import { useState } from 'react'
import { Space, Typography, Upload } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'

import { IProjectWithData } from '@/lib/index.d'

import Dialog from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import GeometryAPI from '@/api/geometry'

export interface IProps {
  visible: boolean
  project: IProjectWithData
  swr: {
    mutateProject: Function
    addOneGeometry: Function
  }
  setVisible: Function
}

/**
 * Errors (add)
 * @memberof Components.Project.Geometry
 */
const errors = {
  addError: 'Unable to add geometry'
}

/**
 * Add
 * @memberof Components.Project.Geometry
 * @param props Props
 */
const Add = ({ visible, project, swr, setVisible }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * Upload check
   * @param file File
   */
  const beforeUpload = (file: { name: string }): boolean => {
    return (
      file.name.toLowerCase().includes('.stp') ||
      file.name.toLowerCase().includes('.step') ||
      file.name.toLowerCase().includes('.dxf')
    )
  }

  /**
   * On upload
   * @param info Info
   */
  const onUpload = async (info: UploadChangeParam<any>): Promise<void> => {
    if (info.file.status === 'uploading') setLoading(true)

    if (info.file.status === 'done') {
      const buffer = await getFile(info.file.originFileObj)

      try {
        // API
        const geometry = await GeometryAPI.add(
          { id: project.id },
          {
            name: info.file.name,
            uid: info.file.uid,
            buffer: Buffer.from(buffer)
          }
        )

        // Local
        swr.addOneGeometry(geometry)
        swr.mutateProject({
          geometries: [...(project.geometries || []), geometry.id]
        })

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err) {
        ErrorNotification(errors.addError, err)
        setLoading(false)
      }
    }
  }

  /**
   * Get file
   * @param file File
   */
  const getFile = async (file: Blob): Promise<any> => {
    const reader = new FileReader()
    return new Promise((resolve) => {
      reader.addEventListener('load', () => {
        resolve(reader.result)
      })
      reader.readAsArrayBuffer(file)
    })
  }

  return (
    <Dialog
      title="Upload geometry"
      visible={visible}
      onCancel={() => setVisible(false)}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
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
              <>
                <LoadingOutlined style={{ fontSize: 25 }} />
                <div style={{ marginTop: 8 }}>
                  <b>Loading</b>, converting, ...
                </div>
              </>
            ) : (
              <>
                <UploadOutlined style={{ fontSize: 25 }} />
                <div style={{ marginTop: 8 }}>
                  <b>Choose a file</b> or drop it here
                </div>
              </>
            )}
          </div>
        </Upload>
      </Space>
    </Dialog>
  )
}

Add.propTypes = {
  visible: PropTypes.bool,
  project: PropTypes.exact({
    id: PropTypes.string.isRequired,
    geometries: PropTypes.array.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateProject: PropTypes.func.isRequired,
    addOneGeometry: PropTypes.func.isRequired
  }).isRequired,
  setVisible: PropTypes.func.isRequired
}

export default Add
