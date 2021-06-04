import { useState } from 'react'
import { Space, Typography, Upload } from 'antd'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'

const Add = ({ visible, setVisible }) => {
  // State
  const [loading, setLoading] = useState(false)

  const onOk = () => console.log('onOk')

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

      // // Diff scheme
      // const diff = {
      //   ...simulation.scheme.configuration.geometry,
      //   file: {
      //     type: 'geometry',
      //     name: info.file.name,
      //     uid: info.file.uid,
      //     buffer: Buffer.from(buffer)
      //   },
      //   done: true
      // }

      try {
        //   // Update simulation
        //   await SimulationAPI.update({ id: simulation.id }, [
        //     {
        //       key: 'scheme',
        //       type: 'json',
        //       method: 'set',
        //       path: ['configuration', 'geometry'],
        //       value: diff
        //     }
        //   ])
        //   // Mutate simulation
        //   swr.mutateOneSimulation({ ...simulation }, true)
        // TODO
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

  return (
    <Dialog
      title="Upload geometry"
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={onOk}
      okButtonProps={{ style: { display: 'none' } }}
    >
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
                  <b>Choose a file</b> or drap it here
                </div>
              </>
            )}
          </div>
        </Upload>
      </Space>
    </Dialog>
  )
}

export default Add
