/** @module Components.Assets.Button.Download */

import { ReactNode } from 'react'
import { Button, Tooltip } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  loading?: boolean
  bordered?: boolean
  children?: ReactNode
  onDownload: () => void
}

/**
 * Download button
 * @param props Props
 *
 * Props list:
 * - disabled (boolean) Set disabled state
 * - loading (boolean) Set loading state
 * - bordered (boolean) Set border
 * - children (React child) Button children
 * - onDownload (Function) Button click
 * @returns DownloadButton
 */
const DownloadButton: React.FunctionComponent<IProps> = ({
  disabled,
  loading,
  bordered,
  children,
  onDownload
}) => {
  /**
   * Render
   */
  return (
    <Tooltip title={children ?? 'Download'}>
      <Button
        className={`${globalStyle.noBackground} ${
          bordered ? '' : globalStyle.noBorder
        }`}
        disabled={disabled}
        loading={loading}
        icon={<DownloadOutlined />}
        onClick={onDownload}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

export default DownloadButton
