/** @module Components.Assets.SidePanels */

import { useCallback, useEffect, useRef, useState } from 'react'

import style from './index.module.css'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'

/**
 * Props
 */
export interface IProps {
  className?: string
  leftChild: React.JSX.Element
  rightChild: React.JSX.Element
}

/**
 * Divider props
 */
export interface IDividerProps {
  onMove: (x: number) => void
  onDoubleClick: () => void
}

/**
 * Rect
 */
export interface IRect {
  left: number
  width: number
}

// Role
const DividerRole = 'Divider'

/**
 * Divider
 * @returns Divider
 */
export const Divider = ({
  onMove,
  onDoubleClick
}: IDividerProps): React.JSX.Element => {
  // State
  const [activated, setActivated] = useState<boolean>(false)

  /**
   * On mouse down
   */
  const onMouseDown = useCallback((): void => {
    setActivated(true)
  }, [])

  /**
   * On mouse move
   * @param e Event
   */
  const onMouseMove = useCallback(
    (e: MouseEvent): void => {
      if (activated) {
        e.preventDefault()
        onMove(e.clientX)
      }
    },
    [activated, onMove]
  )

  /**
   * On mouse up
   */
  const onMouseUp = useCallback((): void => {
    setActivated(false)
  }, [])

  // Init
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  })

  /**
   * Render
   */
  return (
    <div
      role={DividerRole}
      className={style.divider}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <div className="circle" />
      <ArrowLeftOutlined
        className="arrowLeft"
        style={{ fontSize: 20, fontWeight: 'bold' }}
      />
      <ArrowRightOutlined
        className="arrowRight"
        style={{ fontSize: 20, fontWeight: 'bold' }}
      />
    </div>
  )
}

/**
 * Side panels
 * @param props Props
 * @returns SidePanels
 */
const SidePanels = ({
  className,
  leftChild,
  rightChild
}: IProps): React.JSX.Element => {
  // Ref
  const containerRef = useRef<HTMLDivElement>(null)

  // State
  const [containerRect, setContainerRect] = useState<IRect>()
  const [leftWidth, setLeftWidth] = useState<number>()
  const [rightWidth, setRightWidth] = useState<number>()

  /**
   * On resize
   */
  const onResize = useCallback((): void => {
    /* istanbul ignore next */
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    setContainerRect({
      left: rect.left,
      width: rect.width
    })

    setLeftWidth((rect.width - 5) / 2)
    setRightWidth((rect.width - 5) / 2)
  }, [])

  /**
   * On move
   * @param x X
   */
  const onMove = useCallback(
    (x: number): void => {
      /* istanbul ignore next */
      if (!containerRef.current) return
      /* istanbul ignore next */
      if (!containerRect) return

      let leftWidth = x - containerRect.left
      let rightWidth = containerRect.width - x + containerRect.left

      if (rightWidth < 50) {
        rightWidth = 0
        leftWidth = containerRect.width - 5
      } else if (leftWidth < 50) {
        leftWidth = 0
        rightWidth = containerRect.width - 5
      }

      setLeftWidth(leftWidth)
      setRightWidth(rightWidth)
    },
    [containerRect]
  )

  // Init
  useEffect(() => {
    window.addEventListener('resize', onResize)
    setTimeout(onResize, 500)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  /**
   * Render
   */
  return (
    <div ref={containerRef} className={`${style.container} ${className ?? ''}`}>
      <div style={{ width: leftWidth }}>{leftChild}</div>
      <Divider onMove={onMove} onDoubleClick={onResize} />
      <div style={{ width: rightWidth }}>{rightChild}</div>
    </div>
  )
}

export default SidePanels
