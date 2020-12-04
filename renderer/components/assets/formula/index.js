/** @module renderer/components/assets/formula */

import { useState, useEffect } from 'react'
import { Input } from 'antd'

/**
 * Formula
 * @param {Object} props Props
 */
const Formula = ({ value, onChange }) => {
  // State
  const [internalValue, setInternalValue] = useState(value)

  // Effect
  useEffect(() => {
    setInternalValue(value)
  }, [value])

  /**
   * On input change
   * @param {Object} event Event
   */
  const onInputChange = (event) => {
    const currentValue = event.target.value
    onChange(currentValue)
  }

  /**
   * Render
   */
  return <Input value={internalValue} onChange={onInputChange} />
}

export default Formula
