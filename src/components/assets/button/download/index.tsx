/** @module Components.Assets.Button.Download */

import { Button, Tooltip } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'

import { globalStyle } from '@/styles'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  loading?: boolean
  bordered?: boolean
  children?: string | React.ReactElement | React.ReactElement[]
  onDownload: () => void
}

/**
 * Download button
 * @param props Props
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - loading (boolean) Set loading state
 * - bordered (boolean) Set border
 * - children (React child) Button children
 * - onDownload (Function) Button click
 * @returns DownloadButton
 */
const DownloadButton = ({
  disabled,
  loading,
  bordered,
  children,
  onDownload
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Tooltip title={children || 'Download'}>
      <Button
        css={css([
          globalStyle.noBackground,
          bordered ? {} : globalStyle.noBorder
        ])}
        className={'no-background ' + (bordered ? '' : 'no-border')}
        disabled={disabled}
        loading={loading}
        icon={<DownloadOutlined />}
        onClick={() => onDownload()}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

export default DownloadButton
