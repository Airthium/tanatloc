import { useState } from 'react'
import { Layout, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

const Geometry = () => {
  const [loading, setLoading] = useState(false)

  return (
    <Layout>
      <Layout.Content>
        <Upload
          accept=".stp,.step,.dxf"
          showUploadList={false}
          listType="picture-card"
        >
          <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Layout.Content>
    </Layout>
  )
}

export default Geometry
