import { useState, useEffect } from 'react'
import { Input, Space, Tag } from 'antd'

import Utils from '@/lib/utils'

const EmailsInput = ({ values, onChange }) => {
  // State
  const [emails, setEmails] = useState([])
  const [value, setValue] = useState('')

  useEffect(() => {
    if (values) setEmails(values)
  }, [values])

  /**
   * On input change
   * @param {Object} event Event
   */
  const onInputChange = (event) => {
    let text = event.target.value

    const lastChar = text[text.length - 1]
    if (lastChar === ' ' || lastChar === ',') {
      const newEmails = extractEmails(text)

      if (newEmails?.length) {
        setEmails([...emails, ...newEmails])
        onChange([...emails, ...newEmails])

        // Remove emails from text
        newEmails.forEach((email) => {
          text = text.replace(email, '')
        })

        // Remove last char from text
        const index = text.lastIndexOf(lastChar)
        text = text.substring(0, index)

        setValue(text)
        return
      }
    }

    setValue(text)
  }

  /**
   * Extract emails
   * @param {string} text Text
   */
  const extractEmails = (text) => {
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
  }

  /**
   * On close
   * @param {number} index Index
   */
  const onClose = (index) => {
    const newEmails = emails.filter((_, i) => i !== index)
    setEmails(newEmails)
    onChange(newEmails)
  }

  /**
   * Render
   */
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space direction="horizontal" style={{ width: '100%' }} wrap={true}>
        {emails.map((email, index) => (
          <Tag
            key={index}
            color={Utils.stringToColor(email)}
            closable={true}
            onClose={() => onClose(index)}
          >
            {email}
          </Tag>
        ))}
      </Space>
      <Input placeholder="Emails" value={value} onChange={onInputChange} />
    </Space>
  )
}

export default EmailsInput
