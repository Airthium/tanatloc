/** @module Components.Project.Geometry.Add */

import { useCallback, useState } from 'react'
import { Space, Typography, Upload, UploadFile } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'

import { IFrontProject, IFrontNewGeometry } from '@/api/index.d'

import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import GeometryAPI from '@/api/geometry'

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  project: Pick<IFrontProject, 'id' | 'geometries'>
  swr: {
    mutateProject: (project: Partial<IFrontProject>) => Promise<void>
    addOneGeometry: (geometry: IFrontNewGeometry) => Promise<void>
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
export const _beforeUpload = (file: { name: string }): boolean => {
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
export const _getFile = async (file: Blob): Promise<any> => {
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
export const _onUpload = async (
  project: Pick<IFrontProject, 'id' | 'geometries'>,
  info: UploadChangeParam<any>,
  swr: {
    mutateProject: (project: Partial<IFrontProject>) => Promise<void>
    addOneGeometry: (geometry: IFrontNewGeometry) => Promise<void>
  }
): Promise<boolean> => {
  if (info.file.status === 'uploading') return true
  if (info.file.status === 'done') {
    const buffer = await _getFile(info.file.originFileObj)

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
      await swr.addOneGeometry(geometry)
      await swr.mutateProject({
        id: project.id,
        geometries: [...project.geometries, geometry.id]
      })
    } catch (err: any) {
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

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [setVisible])

  /**
   * On change
   * @param info Info
   */
  const onChange = useCallback(
    (info: UploadChangeParam<UploadFile<any>>): void => {
      ;(async () => {
        try {
          const load = await _onUpload(project, info, swr)
          setLoading(load)
          setVisible(load)
        } catch (err) {
          setLoading(false)
        }
      })()
    },
    [project, swr, setVisible]
  )

  /**
   * Render
   */
  return (
    <Dialog
      title="Upload geometry"
      visible={visible}
      onCancel={setVisibleFalse}
      cancelButtonProps={{ loading: loading }}
    >
      <Space direction="vertical" className={globalStyle.fullWidth}>
        <Upload
          className={style.upload}
          action={'/api/noop'}
          accept=".stp,.step,.dxf"
          showUploadList={false}
          listType="picture-card"
          beforeUpload={_beforeUpload}
          onChange={onChange}
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
