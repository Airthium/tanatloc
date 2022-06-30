/** @module Components.Project.Geometry.Add */

import { useState } from 'react'
import { Space, Typography, Upload } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import { IFrontProject, IFrontNewGeometry } from '@/api/index.d'
import GeometryAPI from '@/api/geometry'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  project: Pick<IFrontProject, 'id' | 'geometries'>
  swr: {
    mutateProject: (project: Partial<IFrontProject>) => void
    addOneGeometry: (geometry: IFrontNewGeometry) => void
  }
  setVisible: (visible: boolean) => void
}

/**
 * Errors
 */
export const errors = {
  add: 'Unable to add geometry'
}

/**
 * Upload check
 * @param file File
 */
export const beforeUpload = (file: { name: string }): boolean => {
  return (
    file.name.toLowerCase().includes('.stp') ||
    file.name.toLowerCase().includes('.step') ||
    file.name.toLowerCase().includes('.dxf')
  )
}

/**
 * Get file
 * @param file File
 */
export const getFile = async (file: Blob): Promise<any> => {
  const reader = new FileReader()
  return new Promise((resolve) => {
    reader.addEventListener('load', () => {
      resolve(reader.result)
    })
    reader.readAsArrayBuffer(file)
  })
}

/**
 * On upload
 * @param project Project
 * @param info Info
 * @param swr SWR
 */
export const onUpload = async (
  project: Pick<IFrontProject, 'id' | 'geometries'>,
  info: UploadChangeParam<any>,
  swr: {
    mutateProject: (project: Partial<IFrontProject>) => void
    addOneGeometry: (geometry: IFrontNewGeometry) => void
  }
): Promise<boolean> => {
  if (info.file.status === 'uploading') return true
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
        id: project.id,
        geometries: [...project.geometries, geometry.id]
      })
    } catch (err) {
      ErrorNotification(errors.add, err)
      throw err
    }
  }

  return false
}

/**
 * Add
 * @param props Props
 * @returns Add
 */
const Add = ({ visible, project, swr, setVisible }: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <Dialog
      title="Upload geometry"
      visible={visible}
      onCancel={() => setVisible(false)}
      cancelButtonProps={{ loading: loading }}
    >
      <Space direction="vertical" className="full-width">
        <Upload
          className="upload"
          action={'/api/noop'}
          accept=".stp,.step,.dxf"
          showUploadList={false}
          listType="picture-card"
          beforeUpload={beforeUpload}
          onChange={async (info) => {
            try {
              const load = await onUpload(project, info, swr)
              setLoading(load)
              setVisible(load)
            } catch (err) {
              setLoading(false)
            }
          }}
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
        <Typography.Text>
          <p style={{ color: 'rgba(0, 0, 0, 0.45)', textAlign: 'center' }}>
            Native file format preferred: STEP (3D) or DXF (2D) file
          </p>
        </Typography.Text>
      </Space>
    </Dialog>
  )
}

export default Add
