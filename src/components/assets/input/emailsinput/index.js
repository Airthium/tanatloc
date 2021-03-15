import { useState, useEffect } from 'react'
import { Input, Space, Tag } from 'antd'

import Utils from '@/lib/utils'

const EmailsInput = ({ values }) => {
  // State
  const [emails, setEmails] = useState([])
  const [value, setValue] = useState('')

  useEffect(() => {
    if (values) setEmails(values.map((v) => v.email))
  }, [values])

  /**
   * On change
   * @param {Object} event Event
   */
  const onChange = (event) => {
    let text = event.target.value

    const lastChar = text[text.length - 1]
    if (lastChar === ' ' || lastChar === ',') {
      const newEmails = extractEmails(text)

      if (newEmails?.length) {
        setEmails([...emails, ...newEmails])

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
    const newEmails = emails.filter((e, i) => i !== index)
    setEmails(newEmails)
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
      <Input placeholder="Emails" value={value} onChange={onChange} />
    </Space>
  )
}

export default EmailsInput
