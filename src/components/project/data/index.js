import { useState, useEffect } from 'react'
import { Button, Checkbox, Drawer, Layout, Space, Table } from 'antd'
import { LineChartOutlined, UpOutlined } from '@ant-design/icons'
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

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

const camelize = (str) => {
  return str.replace(/\W+(.)/g, (_, chr) => {
    return chr.toUpperCase()
  })
}

// TODO bug in columns selection

/**
 * Data visualization
 * @param {Object} props Props
 */
const Data = ({ simulation }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [table, setTable] = useState()
  const [columnSelection, setColumnSelection] = useState([])
  const [plot, setPlot] = useState()

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
        title: (
          <Space>
            {n}
            <Checkbox onChange={() => onCheck(n, camelNames[index])}>
              <LineChartOutlined />
            </Checkbox>
          </Space>
        ),
        dataIndex: camelNames[index],
        key: camelNames[index]
      }))
      tableColumns.unshift({
        title: (
          <Button style={{ color: 'red', backgroundColor: 'blue' }}>
            Export CSV
          </Button>
        ),
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

  // Check effect
  useEffect(() => {
    const tableData = table?.data
    if (!tableData?.length) return

    // Set lines
    const keys = []
    const lines = columnSelection.map((selection, index) => {
      keys.push(selection.key)

      return (
        <Line
          key={index}
          name={selection.name}
          type="monotone"
          dataKey={selection.key}
          stroke={Utils.stringToColor(selection.key)}
          strokeWidth={2}
        />
      )
    })

    // Set data
    const data = tableData
      .map((d) => {
        const part = { x: d.x }
        keys.forEach((key) => {
          d[key] && (part[key] = d[key])
        })
        return part
      })
      .filter((d) => d)

    const min = Math.min(...keys.flatMap((key) => data.map((d) => d[key])))
    const max = Math.max(...keys.flatMap((key) => data.map((d) => d[key])))

    setPlot({ data, min, max, lines })
  }, [columnSelection])

  /**
   * On check
   * @param {string} name Name
   * @param {string} key Key
   */
  const onCheck = (name, key) => {
    const index = columnSelection.findIndex((s) => s.key === key)
    if (index === -1) {
      setColumnSelection([...columnSelection, { name, key }])
    } else {
      setColumnSelection([
        ...columnSelection.slice(0, index),
        ...columnSelection.slice(index + 1)
      ])
    }
  }

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
              <Table dataSource={table?.data} columns={table?.columns} />
            </div>

            <ResponsiveContainer width="50%" height="100%">
              <LineChart
                data={plot?.data}
                margin={{ top: 40, right: 40, left: 40, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={'x'} />
                <YAxis domain={[plot?.min, plot?.max]} />
                <Tooltip />
                <Legend />
                {plot?.lines}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Drawer>
      </Layout.Content>
    </Layout>
  )
}

export default Data
