import { useEffect, useState } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/ext-language_tools'

import { IConfiguration } from '..'

export interface IProps {
  configuration: IConfiguration
  code: string
  setCode: (code: string) => void
}

//Prevent non wanted code issues
const safeCode = (str: string) => str?.replace(/[^A-Z0-9]+/gi, '')

const Code = ({ configuration, code, setCode }: IProps): JSX.Element => {
  const [header, setHeader] = useState('')

  useEffect(() => {
    let newHeader = ''

    // Informations
    if (configuration.information?.name)
      newHeader += `// Name: ${configuration.information.name}\n`
    if (configuration.information?.category)
      newHeader += `// Category: ${configuration.information.category}\n`

    newHeader += '\n// GLOBAL VARIABLES\n'
    newHeader += '// - func int appendLog(string log)\n'
    newHeader += '//   This function append log to the log report.\n'
    newHeader += '// - func int appendError(string err)\n'
    newHeader += '//   This function append error to the log report.\n'
    newHeader += '// - meshN (2D: mesh, 3D:mesh3)\n'
    newHeader += '//   Mesh variable for 2D and 3D usage.\n'
    newHeader += '// - intN (2D:int2d, 3D:int3d)\n'
    newHeader += '//   Intergation function for 2D and 3D usage.\n'
    newHeader += '// - intN1 (2D:int1d, 3d:int2d)\n'
    newHeader += '//   Intergation function for 2D and 3D usage.\n'

    // Geometry
    if (configuration.geometry && configuration.geometry.meshable) {
      newHeader += '\n// GEOMETRY\n'
      newHeader +=
        '/*** TANATLOC GEOMETRY ***/ meshN ' +
        safeCode(configuration.geometry.name) +
        ' = /* ... */;\n'
    }

    // Numerical parameters
    if (configuration.numericalParameters) {
      if (configuration.numericalParameters.finiteElementSpace) {
        newHeader += '\n// FINITE ELEMENT SPACE\n'
        newHeader +=
          '/*** TANATLOC FESPACE ***/ fespace ' +
          safeCode(configuration.numericalParameters.finiteElementSpace.name) +
          '(' +
          (safeCode(configuration.geometry?.name) || 'Mesh') +
          ', "' +
          configuration.numericalParameters.finiteElementSpace.default +
          '");\n'
        newHeader +=
          '/*** TANATLOC FE FUNCTIONS ***/ ' +
          safeCode(configuration.numericalParameters.finiteElementSpace.name) +
          ' ' +
          safeCode(
            configuration.numericalParameters.finiteElementSpace.unknownFunction
          ) +
          ';\n'
        configuration.numericalParameters.finiteElementSpace.testFunction &&
          (newHeader +=
            '/*** TANATLOC FE FUNCTIONS ***/ ' +
            safeCode(
              configuration.numericalParameters.finiteElementSpace.name
            ) +
            ' ' +
            safeCode(
              configuration.numericalParameters.finiteElementSpace.testFunction
            ) +
            ';\n')
      }

      if (configuration.numericalParameters.solver) {
        newHeader += '\n// SOLVER\n'
        newHeader +=
          '/*** TANATLOC SOLVER ***/ func solver = "' +
          configuration.numericalParameters.solver.default +
          '";\n'
      }
    }

    // Materials
    if (configuration.materials) {
      newHeader += '\n// MATERIALS\n'
      configuration.materials.children?.map((child) => {
        newHeader +=
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
      newHeader += '\n// PARAMETERS\n'
      Object.keys(configuration.parameters).forEach((key) => {
        const parameter = configuration.parameters[key]
        parameter.children.forEach((child) => {
          newHeader +=
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

    // // Boundary conditions
    // if (configuration.boundaryConditions) {
    //   newHeader += '\n// BOUNDARY CONDITIONS\n'
    //   Object.keys(configuration.boundaryConditions).forEach((key) => {
    //     const boundaryCondition = configuration.boundaryConditions[key]
    //     boundaryCondition.children?.forEach((child, index) => {
    //       newHeader +=
    //         '/*** TANATLOC BOUNDARY CONDITION ***/ ' +
    //         boundaryCondition.name +
    //         index +
    //         ' = ' +
    //         child.default +
    //         '\n'
    //     })
    //   })
    // }

    // End
    newHeader += '\n/*** /!\\ WRITE YOUR CODE BELLOW THIS LINE /!\\ ***/\n'

    setHeader(newHeader)
  }, [configuration])

  const onChange = (newCode: string): void => {
    setCode(newCode.replace(header, ''))
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
      value={header + code}
      onChange={onChange}
    />
  )
}

export default Code
