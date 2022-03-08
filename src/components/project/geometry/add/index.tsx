/** @module Components.Project.Geometry.Add */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Space, Typography, Upload } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'

import { IProjectWithData } from '@/lib/index.d'
import { IGeometry } from '@/database/index.d'

import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import GeometryAPI from '@/api/geometry'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  project: IProjectWithData
  swr: {
    mutateProject: (project: IProjectWithData) => void
    addOneGeometry: (geometry: IGeometry) => void
  }
  setVisible: Dispatch<SetStateAction<boolean>>
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
  project: IProps['project'],
  info: UploadChangeParam<any>,
  swr: IProps['swr']
): Promise<void> => {
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
        geometries: [...(project.geometries || []), geometry.id]
      })
    } catch (err) {
      ErrorNotification(errors.add, err)
      throw err
    }
  }
}

/**
 * Add
 * @param props Props
 */
const Add = ({ visible, project, swr, setVisible }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  return (
    <Dialog
      title="Upload geometry"
      visible={visible}
      onCancel={() => setVisible(false)}
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
            if (info.file.status === 'uploading') setLoading(true)
            try {
              await onUpload(project, info, swr)
              // Close
              setLoading(false)
              setVisible(false)
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
