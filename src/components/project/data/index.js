import { useState, useEffect } from 'react'
import { Button, Drawer, Layout, Table } from 'antd'
import { UpOutlined } from '@ant-design/icons'
import {
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import SimulationAPI from '@/api/simulation'

const camelize = (str) => {
  return str.replace(/\W+(.)/g, (_, chr) => {
    return chr.toUpperCase()
  })
}

/**
 * Data visualization
 * @param {Object} props Props
 */
const Data = ({ simulation }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [table, setTable] = useState({})

  // Data
  const [currentSimulation] = SimulationAPI.useSimulation(simulation?.id)

  // Data effect
  useEffect(() => {
    const tasks = currentSimulation?.tasks

    if (tasks) {
      // Get tasks data
      let tasksData = []
      tasks.forEach((task) => {
        if (task.datas) tasksData = [...tasksData, ...task.datas]
      })

      // Aggregate data
      tasksData.sort((a, b) => a.x - b.x)

      const names = tasksData
        .filter(
          (value, index, self) =>
            self.findIndex((s) => s.name === value.name) === index
        )
        .map((d) => d.name)

      const camelNames = names.map((n) => camelize(n))

      const tableColumns = names.map((n, index) => ({
        title: n,
        dataIndex: camelNames[index],
        key: camelNames[index]
      }))
      tableColumns.unshift({
        title: '',
        dataIndex: 'x',
        key: 'x'
      })

      const tableData = []
      tasksData.forEach((d, index) => {
        const existingIndex = tableData.findIndex((t) => t.x === d.x)
        if (existingIndex === -1)
          tableData.push({
            key: index,
            x: d.x,
            [camelize(d.name)]: d.y
          })
        else {
          tableData[existingIndex] = {
            ...tableData[existingIndex],
            [camelize(d.name)]: d.y
          }
        }
      })

      setTable({ columns: tableColumns, data: tableData })
    }
  }, [currentSimulation])

  /**
   * Render
   */
  return (
    <Layout
      style={{
        position: 'absolute',
        zIndex: 100,
        bottom: -15,
        left: 'calc(50vw - 16px)'
      }}
    >
      <Layout.Content>
        <Button
          icon={
            <UpOutlined style={{ position: 'absolute', top: 5, right: 10 }} />
          }
          shape="round"
          onClick={() => setVisible(true)}
          size="large"
        />

        <Drawer
          title="Data visualization"
          placement="bottom"
          closable={true}
          onClose={() => setVisible(false)}
          visible={visible}
          mask={false}
          maskClosable={false}
          height="50vh"
          bodyStyle={{ height: '100%', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ height: '100%', width: '50%', overflow: 'auto' }}>
              <Table dataSource={table?.data} columns={table.columns} />
            </div>

            <ResponsiveContainer width="50%" height="100%">
              <LineChart
                data={[
                  { x: 1, y: 1 },
                  { x: 2, y: 2 }
                ]}
              >
                <CartesianGrid />
                <XAxis dataKey={'x'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="y" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Drawer>
      </Layout.Content>
    </Layout>
  )
}

export default Data
