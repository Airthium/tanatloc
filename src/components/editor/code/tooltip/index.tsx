import { Typography } from 'antd'

export interface IProps {
  tooltipInfos: {
    x: number
    y: number
    currentFunction: {
      name: string
      definition: string
      example: string
      params: string[]
      output: string[]
    }
    display: boolean
  }
}

const CustomTooltip = ({ tooltipInfos }: IProps): JSX.Element => {
  console.log(tooltipInfos.currentFunction.example.split('\n'))
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 10,
        left: tooltipInfos.x,
        top: tooltipInfos.y,
        backgroundColor: 'rgba(13, 17, 23, 0.75)',
        padding: '15px',
        border: '1px solid gray',
        color: '#fff',
        fontFamily: 'Saira',
        whiteSpace: 'pre-line',
        fontSize: '18px'
      }}
    >
      <Typography.Title level={3} style={{ color: '#fff', margin: 0 }}>
        Function : {tooltipInfos.currentFunction.name}
      </Typography.Title>
      <br />
      <Typography.Text style={{ color: '#fff' }}>
        <strong>Definition</strong> : {tooltipInfos.currentFunction.definition}{' '}
      </Typography.Text>
      <br />
      <Typography.Text style={{ color: '#fff' }}>
        <strong>Example</strong> :{' '}
        <div style={{ backgroundColor: '#rgb(64,68,74)' }}>
          <pre>{tooltipInfos.currentFunction.example}</pre>
        </div>
        {/* <code style={{ fontSize: 16 }}>
          {tooltipInfos.currentFunction.example}
        </code>{' '} */}
      </Typography.Text>
      <Typography.Text style={{ color: '#fff' }}>
        <strong>Params</strong> :{' '}
        <code style={{ fontSize: 16 }}>
          {tooltipInfos.currentFunction.params.map((param) => '\n- ' + param)}
        </code>{' '}
      </Typography.Text>
      <br />
      <Typography.Text style={{ color: '#fff' }}>
        <strong>Output</strong> :{' '}
        <code style={{ fontSize: 16 }}>
          {tooltipInfos.currentFunction.output.map((output) => '\n- ' + output)}
        </code>{' '}
      </Typography.Text>
      <br />
      <Typography.Text style={{ color: '#fff' }}>
        <strong>Link to FreeFEM</strong> :{' '}
      </Typography.Text>
      <br />

      <a
        href={
          'https://doc.freefem.org/references/functions.html#' +
          tooltipInfos.currentFunction.name
        }
        target="_blank"
        rel="noreferrer"
      >
        https://doc.freefem.org/references/functions.html#
        {tooltipInfos.currentFunction.name}
      </a>
    </div>
  )
}

export default CustomTooltip
