/** @module Components.Project.Geometry.Add */

import { useCallback, useContext, useState } from 'react'
import { Space, Typography, Upload, UploadFile } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'

import { IFrontProject, IFrontNewGeometry } from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'
import Dialog from '@/components/assets/dialog'

import GeometryAPI from '@/api/geometry'

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

/**
 * Props
 */
export type Project = Pick<IFrontProject, 'id' | 'geometries'>
export type Swr = {
  mutateProject: (project: Partial<IFrontProject>) => Promise<void>
  addOneGeometry: (geometry: IFrontNewGeometry) => Promise<void>
}
export interface IProps {
  visible: boolean
  project: Project
  swr: Swr
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
  project: Project,
  info: UploadChangeParam<any>,
  swr: Swr
): Promise<boolean> => {
  if (info.file.status === 'uploading') return true
  if (info.file.status === 'done') {
    const buffer = await _getFile(info.file.originFileObj)

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
  }

  return false
}

/**
 * Add
 * @param props Props
 * @returns Add
 */
const Add: React.FunctionComponent<IProps> = ({
  visible,
  project,
  swr,
  setVisible
}) => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

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
      asyncFunctionExec(async () => {
        try {
          const load = await _onUpload(project, info, swr)
          setLoading(load)
          setVisible(load)
        } catch (err: any) {
          dispatch(addError({ title: errors.add, err }))
          setLoading(false)
        }
      })
    },
    [project, swr, setVisible, dispatch]
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
