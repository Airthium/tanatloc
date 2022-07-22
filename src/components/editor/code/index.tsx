import React from 'react'
import AceEditor from 'react-ace'
import FreefemCode from './freefem_editor'
import JsonCode from './json_editor'

export default function Code() {
  return (
    <div style={{ display: 'flex' }}>
      <FreefemCode />
      <JsonCode />
    </div>
  )
}
