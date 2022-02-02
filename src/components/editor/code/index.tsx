import { useEffect, useState } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/ext-language_tools'

import { IConfiguration } from '..'

export interface IProps {
  configuration: IConfiguration
}

const safeCode = (str) => str?.replace(/[^A-Z0-9]+/gi, '')

const Code = ({ configuration }: IProps): JSX.Element => {
  const [code, setCode] = useState('')

  useEffect(() => {
    let header = ''

    // Informations
    if (configuration.information?.name)
      header += `// Name: ${configuration.information.name}\n`
    if (configuration.information?.category)
      header += `// Category: ${configuration.information.category}\n`

    header += '\n// GLOBAL VARIABLES\n'
    header += '// - func int appendLog(string log)\n'
    header += '//   This function append log to the log report.\n'
    header += '// - func int appendError(string err)\n'
    header += '//   This function append error to the log report.\n'
    header += '// - meshN (2D: mesh, 3D:mesh3)\n'
    header += '//   Mesh variable for 2D and 3D usage.\n'
    header += '// - intN (2D:int2d, 3D:int3d)\n'
    header += '//   Intergation function for 2D and 3D usage.\n'
    header += '// - intN1 (2D:int1d, 3d:int2d)\n'
    header += '//   Intergation function for 2D and 3D usage.\n'

    // Geometry
    if (configuration.geometry && configuration.geometry.meshable) {
      header += '\n// GEOMETRY\n'
      header +=
        '/*** TANATLOC GEOMETRY ***/ meshN ' +
        safeCode(configuration.geometry.name) +
        ' = /* ... */;\n'
    }

    // Numerical parameters
    if (configuration.numericalParameters) {
      if (configuration.numericalParameters.finiteElementSpace) {
        header += '\n// FINITE ELEMENT SPACE\n'
        header +=
          '/*** TANATLOC FESPACE ***/ fespace ' +
          safeCode(configuration.numericalParameters.finiteElementSpace.name) +
          '(' +
          (safeCode(configuration.geometry?.name) || 'Mesh') +
          ', "' +
          configuration.numericalParameters.finiteElementSpace.default +
          '");\n'
      }

      if (configuration.numericalParameters.solver) {
        header += '\n// SOLVER\n'
        header +=
          '/*** TANATLOC SOLVER ***/ func solver = "' +
          configuration.numericalParameters.solver.default +
          '";\n'
      }
    }

    // Materials
    if (configuration.materials) {
      header += '\n// MATERIALS\n'
      configuration.materials.children?.map((child) => {
        header +=
          '/*** TANATLOC MATERIAL ***/ func ' +
          safeCode(child.name) +
          ' = ' +
          child.default +
          '; // ' +
          child.unit +
          '\n'
      })
    }

    // Physical parameters
    if (configuration.parameters) {
      header += '\n// PARAMETERS\n'
      Object.keys(configuration.parameters).forEach((key) => {
        const parameter = configuration.parameters[key]
        parameter.children.forEach((child) => {
          header +=
            '/*** TANATLOC PARAMETER ***/ real ' +
            safeCode(parameter.name) +
            safeCode(child.name) +
            ' = ' +
            child.default +
            '; // ' +
            child.unit +
            '\n'
        })
      })
    }

    // Initialization TODO

    // Boundary conditions
    if (configuration.boundaryConditions) {
      header += '\n// BOUNDARY CONDITIONS\n'
      Object.keys(configuration.boundaryConditions).forEach((key) => {
        const boundaryCondition = configuration.boundaryConditions[key]
        boundaryCondition.children?.forEach((child, index) => {
          header +=
            '/*** TANATLOC BOUNDARY CONDITION ***/ ' +
            boundaryCondition.name +
            index +
            ' = ' +
            child.default +
            '\n'
        })
      })
    }

    setCode(header)
  }, [configuration])

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
      fontSize={14}
      value={code}
      onChange={onChange}
    />
  )
}

export default Code
