import { Typography } from 'antd'

export interface IProps {
  tooltipInfos: {
    x: number
    y: number
    currentToken: {
      name: string
      definition: string
      example: string
      params?: string[]
      output?: string[]
    }
    display: boolean
  }
}

const CustomTooltip = ({ tooltipInfos }: IProps): JSX.Element => {
  let bodyHeight = document.querySelector('body')?.offsetHeight
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 10,
        left: tooltipInfos.x,
        top:
          bodyHeight && bodyHeight - tooltipInfos.y > tooltipInfos.y
            ? tooltipInfos.y
            : 'unset',
        bottom:
          bodyHeight && bodyHeight - tooltipInfos.y < tooltipInfos.y
            ? bodyHeight - tooltipInfos.y + 16
            : 'unset',
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
        Function : {tooltipInfos.currentToken.name}
      </Typography.Title>
      <br />
      {tooltipInfos.currentToken.definition && (
        <>
          <Typography.Text style={{ color: '#fff' }}>
            <strong>Definition</strong> : {tooltipInfos.currentToken.definition}{' '}
          </Typography.Text>
          <br />
        </>
      )}

      {tooltipInfos.currentToken.example && (
        <Typography.Text style={{ color: '#fff' }}>
          <strong>Example</strong> :{' '}
          <div style={{ backgroundColor: '#rgb(64,68,74)' }}>
            <pre>{tooltipInfos.currentToken.example}</pre>
          </div>
        </Typography.Text>
      )}
      {tooltipInfos.currentToken.params && (
        <>
          <Typography.Text style={{ color: '#fff' }}>
            <strong>Params</strong> :{' '}
            <code style={{ fontSize: 16 }}>
              {tooltipInfos.currentToken.params.map((param) => '\n- ' + param)}
            </code>{' '}
          </Typography.Text>
          <br />
        </>
      )}

      {tooltipInfos.currentToken.output && (
        <>
          <Typography.Text style={{ color: '#fff' }}>
            <strong>Output</strong> :{' '}
            <code style={{ fontSize: 16 }}>
              {tooltipInfos.currentToken.output.map(
                (output) => '\n- ' + output
              )}
            </code>{' '}
          </Typography.Text>
          <br />
        </>
      )}
      <Typography.Text style={{ color: '#fff' }}>
        <strong>Link to FreeFEM</strong> :{' '}
      </Typography.Text>
      <br />
      <a
        href={
          'https://doc.freefem.org/references/functions.html#' +
          tooltipInfos.currentToken.name
        }
        target="_blank"
        rel="noreferrer"
      >
        https://doc.freefem.org/references/functions.html#
        {tooltipInfos.currentToken.name}
      </a>
    </div>
  )
}

export default CustomTooltip
