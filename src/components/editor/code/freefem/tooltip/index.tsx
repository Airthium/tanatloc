/** @module Components.Editor.Code.FreeFEM.Tooltip */

import { CSSProperties, useMemo } from 'react'
import Link from 'next/link'
import { Card, Space, Typography } from 'antd'

import { IToken } from '..'

import globalStyle from '@/styles/index.module.css'
import style from '../../../index.module.css'

/**
 * Props
 */
export interface IProps {
  x: number
  y: number
  token?: IToken
}

export interface IStyle {
  left: CSSProperties['left']
  top: CSSProperties['top']
  bottom: CSSProperties['bottom']
  maxWidth: CSSProperties['maxWidth']
  maxHeight: CSSProperties['maxHeight']
}

/**
 * Custom tooltip
 * @param props Props
 * @returns CustomTooltip
 */
const CustomTooltip = ({ x, y, token }: IProps): JSX.Element | null => {
  // Width
  const width = document.querySelector('body')?.offsetWidth

  // Height
  const height = document.querySelector('body')?.offsetHeight

  // Position
  const position = useMemo(() => {
    const pos: IStyle = {
      left: x - 256,
      top: 'unset',
      bottom: 'unset',
      maxWidth: 'unset',
      maxHeight: 'unset'
    }

    if (width) pos.maxWidth = width - x - 50

    if (height) {
      if (y < height / 2) {
        pos.maxHeight = height - y - 50
        pos.top = y + 16
      } else {
        pos.maxHeight = y - 128 - 50
        pos.bottom = height - y
      }
    }

    return pos
  }, [width, height, x, y])

  /**
   * Render
   */
  if (!token) return null
  return (
    <Card
      title={<>Function: {token.name}</>}
      extra={
        <Link
          href={
            'https://doc.freefem.org/references/functions.html#' +
            (token.docReference ? token.docReference : token.name)
          }
          target="_blank"
        >
          Go to FreeFEM documentation
        </Link>
      }
      className={style.tooltip}
      style={position}
    >
      <Space direction="vertical">
        <div>
          <Typography.Text className={globalStyle.textWhite} strong>
            Definition:
          </Typography.Text>{' '}
          <Typography.Text className={globalStyle.textWhite}>
            {token.definition}{' '}
          </Typography.Text>
        </div>

        <>
          <Typography.Text className={globalStyle.textWhite} strong>
            Example:
          </Typography.Text>
          {token.example.split('\n').map((ex) => {
            if (!ex) return
            return (
              <Typography.Text key={ex} className={globalStyle.textWhite} code>
                {ex}
              </Typography.Text>
            )
          })}
        </>

        {token.params && (
          <>
            <Typography.Text className={globalStyle.textWhite} strong>
              Params:
            </Typography.Text>
            {token.params.map((param) => (
              <Typography.Text
                key={param}
                className={globalStyle.textWhite}
                code
              >
                - {param}
                <br />
              </Typography.Text>
            ))}
          </>
        )}

        {token.output && (
          <>
            <Typography.Text className={globalStyle.textWhite} strong>
              Output:
            </Typography.Text>
            {token.output.map((output) => (
              <Typography.Text
                key={output}
                className={globalStyle.textWhite}
                code
              >
                - {output}
                <br />
              </Typography.Text>
            ))}
          </>
        )}
      </Space>
    </Card>
  )
}

export default CustomTooltip
