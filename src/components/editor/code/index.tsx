import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/ext-language_tools'

const Code = () => {
  const onChange = (code: string): void => {
    console.log(code)
  }

  /**
   * Render
   */
  return (
    <AceEditor
      mode="c_cpp"
      theme="chrome"
      width="100%"
      height="100%"
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true
      }}
      onChange={onChange}
    />
  )
}

export default Code
