import PropTypes from 'prop-types'
import { Button, Tooltip } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { ReactChild } from 'react'

export interface IProps {
  disabled?: boolean
  loading?: boolean
  children?: ReactChild | ReactChild[]
  onDownload: Function
}

/**
 * Download button
 * @memberof Components.Assets.Button
 * @param props Props
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - loading (boolean) Set loading state
 * - children (React child) Button children
 * - onDownload (Function) Button click
 */
const DownloadButton = ({
  disabled,
  loading,
  children,
  onDownload
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Tooltip title="Download">
      <Button
        disabled={disabled}
        loading={loading}
        icon={<DownloadOutlined />}
        style={{ backgroundColor: 'none', border: 'none' }}
        onClick={() => onDownload()}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

DownloadButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
  onDownload: PropTypes.func.isRequired
}

export default DownloadButton