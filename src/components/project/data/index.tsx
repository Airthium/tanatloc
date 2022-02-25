/** @module Components.Project.Data */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import {
  Button,
  Checkbox,
  Drawer,
  Layout,
  Space,
  Table,
  TableColumnsType,
  Tooltip
} from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import {
  FileTextOutlined,
  LineChartOutlined,
  UpOutlined
} from '@ant-design/icons'
import {
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis
} from 'recharts'
import { camelCase } from 'lodash'

import { ISimulation } from '@/database/index.d'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  simulation: ISimulation
}

/**
 * Data visualization
 * @param props Props
 */
const Data = ({ simulation }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [infos, setInfos]: [
    { names: string[]; camelNames: string[] },
    Function
  ] = useState()
  const [table, setTable]: [
    { columns: TableColumnsType; data: Array<any> },
    Function
  ] = useState()
  const [columnSelection, setColumnSelection]: [
    { checked: boolean }[],
    Function
  ] = useState([])
  const [plot, setPlot]: [
    { data: { x: number }[]; min: number; max: number; lines: JSX.Element[] },
    Function
  ] = useState()
  const [downloading, setDownloading]: [boolean, Function] = useState(false)

  // Data
  const [currentSimulation] = SimulationAPI.useSimulation(simulation?.id)

  // Data effect
  useEffect(() => {
    const tasks = currentSimulation?.tasks

    if (tasks) {
      // Get tasks data
      let tasksData = []
      tasks.forEach((task) => {
        if (task?.datas) tasksData = [...tasksData, ...task.datas]
      })

      // Aggregate data
      tasksData.sort((a, b) => a.x - b.x)

      const names = tasksData
        .filter(
          (value, index, self) =>
            self.findIndex((s) => s.name === value.name) === index
        )
        .map((d) => d.name)

      const camelNames = names.map((n) => camelCase(n))

      const tableColumns: {
        align?: string
        title: string | JSX.Element
        dataIndex: string
        key: string
      }[] = names.map((n, index) => ({
        align: 'center',
        title: (
          <Space>
            {n}
            <Checkbox
              checked={columnSelection[index]?.checked}
              onChange={(event) => onCheck(event, index)}
            >
              <LineChartOutlined />
            </Checkbox>
          </Space>
        ),
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
            [camelCase(d.name)]: d.y
          })
        else {
          tableData[existingIndex] = {
            ...tableData[existingIndex],
            [camelCase(d.name)]: d.y
          }
        }
      })

      setInfos({ names, camelNames })
      setTable({ columns: tableColumns, data: tableData })
    }
  }, [currentSimulation?.tasks, columnSelection])

  // Check effect
  useEffect(() => {
    const tableData = table?.data
    if (!tableData?.length) return

    // Set lines
    const keys = []
    const lines = columnSelection
      .map((selection, index) => {
        if (!selection?.checked) return

        const key = infos.camelNames[index]
        const name = infos.names[index]

        keys.push(key)

        return (
          <Line
            key={index}
            name={name}
            type="monotone"
            dataKey={key}
            stroke={Utils.stringToColor(key)}
            strokeWidth={2}
          />
        )
      })
      .filter((l) => l)

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

    const min = Math.min(
      ...keys.flatMap((key) => data.map((d) => d[key] || null))
    )
    const max = Math.max(
      ...keys.flatMap((key) => data.map((d) => d[key] || null))
    )

    setPlot({ data, min, max, lines })
  }, [table?.data, columnSelection, infos])

  /**
   * On check
   * @param {Object} event Event
   * @param {number} index Index
   * @param {string} name Name
   * @param {string} key Key
   */
  const onCheck = (event: CheckboxChangeEvent, index: number) => {
    const checked = event.target.checked

    const newSelection = [...columnSelection]
    newSelection[index] = {
      checked
    }

    setColumnSelection(newSelection)
  }

  /**
   * Export CSV
   */
  const exportCSV = () => {
    setDownloading(true)

    const separator = ','
    let CSV = ''

    const tableData = table?.data

    // Header
    CSV = 'x' + separator + infos.names.join(separator) + '\n'

    // Data
    tableData.forEach((data) => {
      CSV += data.x
      infos?.camelNames?.forEach((name) => {
        data[name] !== undefined && (CSV += separator + data[name])
      })
      CSV += '\n'
    })

    // Download
    const fileName = (simulation?.name || 'data') + '.csv'
    const file = new File([CSV], fileName, { type: 'text/csv' })
    const url = window.URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    link.click()
    link.remove()

    setDownloading(false)
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
        left: 'calc(50vw - 16px)',
        backgroundColor: 'rgba(255, 255, 255, 0)'
      }}
    >
      <Layout.Content>
        <Tooltip title="Data visualization">
          <Button
            type="primary"
            icon={
              <UpOutlined
                style={{ fontSize: 24, position: 'absolute', top: 4, left: 28 }}
              />
            }
            onClick={() => setVisible(true)}
            style={{
              width: 80,
              height: 80,
              border: '1ps solid gray',
              borderRadius: 30,
              marginBottom: -30
            }}
          />
        </Tooltip>

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
            <div style={{ height: '100%', width: '50%' }}>
              <Button
                loading={downloading}
                disabled={!table?.data}
                icon={<FileTextOutlined />}
                onClick={exportCSV}
              >
                Export CSV
              </Button>
              <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                <Table
                  size="small"
                  dataSource={table?.data}
                  columns={table?.columns}
                />
              </div>
            </div>

            <ResponsiveContainer width="50%" height="100%">
              <LineChart
                data={plot?.data}
                margin={{ top: 0, right: 40, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={'x'} />
                <YAxis domain={[plot?.min, plot?.max]} />
                <ReTooltip />
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

Data.propTypes = {
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })
}

export default Data
