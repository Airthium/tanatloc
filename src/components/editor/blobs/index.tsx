import { Dispatch, useContext } from 'react'
import { Button, Collapse, Space, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

import { IModel } from '@/models/index.d'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import { setCursor, setModel, setTemplate } from '@/context/editor/actions'

import Mesh from './mesh'
import Materials from './materials'

/**
 * Add on cursor
 * @param template Template
 * @param text Text
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const addOnCursor = (
  template: string,
  text: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  if (!cursor) {
    dispatch(setTemplate((template || '') + text))
  } else {
    const row = cursor.row
    const rows = (template || '').split('\n')
    const newTemplate = [
      ...rows.slice(0, row + 1),
      ...text.split('\n'),
      ...rows.slice(row + 1)
    ]
    dispatch(setTemplate(newTemplate.join('\n')))
  }
}

/**
 * Add Header
 * @param template Template
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const addHeader = (
  template: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  addOnCursor(
    template,
    "<%# Headers -%>\n<%- helpers.indent(include('/blobs/headers.edp.ejs'), 1) -%>\n",
    cursor,
    dispatch
  )
  dispatch(setCursor({ row: (cursor?.row || 0) + 2, column: 0 }))
}

/**
 * Add Dimension
 * @param template Template
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const addDimension = (
  template: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  addOnCursor(
    template,
    "<%# Dimension -%>\n<%- helpers.indent(include('/blobs/dimensioning.edp.ejs', {\n\tdimension\n}), 1) -%>\n",
    cursor,
    dispatch
  )
  dispatch(setCursor({ row: (cursor?.row || 0) + 4, column: 0 }))
}

export const addMesh = (
  values: { name: string },
  template: string,
  model: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  if (!template.includes("include('/blobs/mesh.edp.ejs'")) {
    addOnCursor(
      template,
      '<%# Mesh -%>\n<%\nconst mesh = geometry.mesh\nmesh.name = "' +
        values.name +
        "\";\n-%>\n<%- helpers.indent(include('/blobs/mesh.edp.ejs', {\n\tdimension,\n\tmesh\n}), 1) -%>\n",
      cursor,
      dispatch
    )
    dispatch(setCursor({ row: (cursor?.row || 0) + 9, column: 0 }))
  }

  // Model
  let modelJSON: Partial<
    Omit<IModel, 'configuration'> & {
      configuration: Partial<IModel['configuration']>
    }
  >
  try {
    modelJSON = JSON.parse(model)
  } catch (err) {
    modelJSON = {}
  }
  const index = Object.keys(modelJSON.configuration || {}).length
  modelJSON.configuration = {
    ...(modelJSON.configuration || {}),
    geometry: {
      index: index + 1,
      title: 'Geometry',
      mesh: {
        name: values.name
      },
      ...(modelJSON.configuration?.geometry || {}),
      meshable: true
    }
  }
  dispatch(setModel(JSON.stringify(modelJSON, null, '  ')))
}

/**
 * Add Materials
 * @param template Template
 * @param model Model
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const addMaterials = (
  values: { label: string; name: string; default: string; unit: string }[],
  template: string,
  model: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  if (!template.includes("include('/blobs/materials.edp.ejs'")) {
    addOnCursor(
      template,
      "<%# Material -%>\n<%- helpers.indent(include('/blobs/materials.edp.ejs', {\n\tmaterials\n}), 1) -%>\n",
      cursor,
      dispatch
    )
    dispatch(setCursor({ row: (cursor?.row || 4) + 0, column: 0 }))
  }

  // Model
  let modelJSON: Partial<
    Omit<IModel, 'configuration'> & {
      configuration: Partial<IModel['configuration']>
    }
  >
  try {
    modelJSON = JSON.parse(model)
  } catch (err) {
    modelJSON = {}
  }
  const index = Object.keys(modelJSON.configuration || {}).length
  modelJSON.configuration = {
    ...(modelJSON.configuration || {}),
    materials: {
      index: index + 1,
      title: 'Materials',
      ...(modelJSON.configuration?.materials || {}),
      children: [
        ...(modelJSON.configuration?.materials?.children || []),
        ...values.map((value) => ({
          label: value.label,
          name: value.name,
          htmlEntity: 'formula',
          default: +value.default,
          unit: value.unit
        }))
      ]
    }
  }
  dispatch(setModel(JSON.stringify(modelJSON, null, '  ')))
}

/**
 * Add finite element space
 * @param template Template
 * @param model Model
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const addFiniteElementSpace = (
  template: string,
  model: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  addOnCursor(
    template,
    "<%# Finite element space -%>\n<%\nconst finiteElementSpace = parameters.finiteElementSpace.children[0]\nfiniteElementSpace.name = 'FiniteElementSpaceName'\n-%>\n<%- helpers.indent(include('/blobs/fespace.edp.ejs', {\n\tmesh,\n\tfiniteElementSpace\n}), 1) -%>\n",
    cursor,
    dispatch
  )
  dispatch(setCursor({ row: (cursor?.row || 9) + 0, column: 0 }))

  // Model
  let modelJSON: Partial<
    Omit<IModel, 'configuration'> & {
      configuration: Partial<IModel['configuration']>
    }
  >
  try {
    modelJSON = JSON.parse(model)
  } catch (err) {
    modelJSON = {}
  }
  const index = Object.keys(modelJSON.configuration || {}).length
  modelJSON.configuration = {
    ...(modelJSON.configuration || {}),
    parameters: {
      index: index + 1,
      title: 'Parameters',
      ...(modelJSON.configuration?.parameters || {}),
      finiteElementSpace: {
        advanced: true,
        label: 'Finite element space',
        ...((modelJSON.configuration?.parameters
          ?.finiteElementSpace as object) || {}),
        children: [
          ...((modelJSON.configuration?.parameters?.finiteElementSpace as any)
            ?.children || []),
          {
            label: 'Finite element space label',
            label2D: 'Finite element space label (2D)',
            htmlEntity: 'select',
            options: [
              {
                label: 'Option label',
                value: 'Option value',
                value2D: 'Option value (2D)'
              }
            ],
            default: 'Default option',
            default2D: 'Default option (2D)'
          }
        ]
      }
    }
  }
  dispatch(setModel(JSON.stringify(modelJSON, null, '  ')))
}

/**
 * Add finite element function
 * @param template Template
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const addFiniteElementFunction = (
  template: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  addOnCursor(
    template,
    "<%# Finite element function -%>\n<%\nconst unknownFunction = dimension === 2 ? '[UnknownFunctionx, UnknownFunctiony]' : '[UnknownFunctionx, UnknownFunctiony, UnknownFunctionz]'\nconst testFunction = dimension === 2 ? '[TestFunctionx, TestFunctiony]' : '[TestFunctionx, TestFunctiony, TestFunctionz]'\n-%>\n<%- helpers.indent(include('/blobs/fespaceFunction.edp.ejs', {\n\tfiniteElementSpace,\n\tfiniteElementFunction: dimension === 2 ? ['UnknownFunctionx', 'UnknownFunctiony'] : ['UnknownFunctionx', 'UnknownFunctiony', 'UnknownFunctionz']\n}), 1) -%>\n",
    cursor,
    dispatch
  )
  dispatch(setCursor({ row: (cursor?.row || 9) + 0, column: 0 }))
}

/**
 * Add macros
 * @param template Template
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const addMacros = (
  template: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  addOnCursor(
    template,
    "<%# Macro -%>\n<%- helpers.indent(include('/blobs/macro.edp.ejs', {\n\tdimension,\n\ttype: ['macro1', 'macro2']\n}), 1) -%>\n",
    cursor,
    dispatch
  )
  dispatch(setCursor({ row: (cursor?.row || 5) + 0, column: 0 }))
}

// /**
//  * Add solver
//  * @param template Template
//  * @param model Model
//  * @param cursor Cursor
//  * @param dispatch Dispatch
//  */
// const addSolver = (
//   template: string,
//   model: string,
//   cursor: IEditorCursor | undefined,
//   dispatch: Dispatch<IEditorAction>
// ): void => {
//   // // Template
//   // addOnCursor(
//   //   template,
//   //   "<%# Finite element space -%>\n<%\nconst finiteElementSpace = parameters.finiteElementSpace.children[0]\nfiniteElementSpace.name = 'FiniteElementSpaceName'\n-%>\n<%- helpers.indent(include('/blobs/fespace.edp.ejs', {\n\tmesh,\n\tfiniteElementSpace\n}), 1) -%>\n",
//   //   cursor,
//   //   dispatch
//   // )
//   // dispatch(setCursor({ row: (cursor?.row || 9) + 0, column: 0 }))
//   // // Model
//   // let modelJSON: Partial<
//   //   Omit<IModel, 'configuration'> & {
//   //     configuration: Partial<IModel['configuration']>
//   //   }
//   // >
//   // try {
//   //   modelJSON = JSON.parse(model)
//   // } catch (err) {
//   //   modelJSON = {}
//   // }
//   // const index = Object.keys(modelJSON.configuration || {}).length
//   // modelJSON.configuration = {
//   //   ...(modelJSON.configuration || {}),
//   //   parameters: {
//   //     index: index + 1,
//   //     title: 'Parameters',
//   //     ...(modelJSON.configuration?.parameters || {}),
//   //     finiteElementSpace: {
//   //       advanced: true,
//   //       label: 'Finite element space',
//   //       ...((modelJSON.configuration?.parameters
//   //         ?.finiteElementSpace as object) || {}),
//   //       children: [
//   //         ...((modelJSON.configuration?.parameters?.finiteElementSpace as any)
//   //           ?.children || []),
//   //         {
//   //           label: 'Finite element space label',
//   //           label2D: 'Finite element space label (2D)',
//   //           htmlEntity: 'select',
//   //           options: [
//   //             {
//   //               label: 'Option label',
//   //               value: 'Option value',
//   //               value2D: 'Option value (2D)'
//   //             }
//   //           ],
//   //           default: 'Default option',
//   //           default2D: 'Default option (2D)'
//   //         }
//   //       ]
//   //     }
//   //   }
//   // }
//   // dispatch(setModel(JSON.stringify(modelJSON, null, '  ')))
// }

/**
 * Blobs
 * @returns Blobs
 */
const Blobs = () => {
  // Data
  const { template, model, cursor, dispatch } = useContext(EditorContext)

  /**
   * Render
   */
  return (
    <>
      <Collapse style={{ overflow: 'auto', maxHeight: 'calc(100% - 443px)' }}>
        <Collapse.Panel key="head" header="Head">
          <Space direction="vertical" className="full-width">
            <Button
              className="full-width"
              onClick={() => addHeader(template, cursor, dispatch)}
            >
              Header
            </Button>
            <Button
              className="full-width"
              onClick={() => addDimension(template, cursor, dispatch)}
            >
              Dimension
            </Button>
          </Space>
        </Collapse.Panel>

        <Collapse.Panel key="components" header="Components">
          <Space direction="vertical" className="full-width">
            <Mesh
              onAdd={(values) =>
                addMesh(values, template, model, cursor, dispatch)
              }
            />
            <Materials
              onAdd={(values) =>
                addMaterials(values, template, model, cursor, dispatch)
              }
            />
            {/* <Button
              className="full-width"
              onClick={() => addMesh(template, model, cursor, dispatch)}
            >
              Mesh
            </Button> */}
            {/* <div className="full-width">
              <Button
                style={{ width: 'calc(100% - 20px)', marginRight: '6px' }}
                onClick={() => addMaterials(template, model, cursor, dispatch)}
              >
                Materials
              </Button>
              <Tooltip
                title={
                  <>
                    Available materials:
                    <ul>
                      <li>todo</li>
                      <li>todo</li>
                    </ul>
                  </>
                }
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </div> */}
            <Button
              className="full-width"
              onClick={() =>
                addFiniteElementSpace(template, model, cursor, dispatch)
              }
            >
              Finite element space
            </Button>
            <Button
              className="full-width"
              onClick={() =>
                addFiniteElementFunction(template, cursor, dispatch)
              }
            >
              Finite element function
            </Button>
            <div className="full-width">
              <Button
                style={{ width: 'calc(100% - 20px)', marginRight: '6px' }}
                onClick={() => addMacros(template, cursor, dispatch)}
              >
                Macros
              </Button>
              <Tooltip
                title={
                  <>
                    Available macros:
                    <ul>
                      <li>scalarGradient</li>
                      <li>vectorialDivergence</li>
                      <li>vectorialDivergenceRZ</li>
                      <li>vectorialEpsilon</li>
                      <li>vectorialGradient</li>
                      <li>vectorialRDivergenceRZ</li>
                    </ul>
                  </>
                }
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <Button
              className="full-width"
              // onClick={() => addSolver(template, model, cursor, dispatch)}
            >
              Solver
            </Button>
          </Space>
        </Collapse.Panel>

        <Collapse.Panel key="results" header="Results">
          <Space direction="vertical" className="full-width">
            <Button className="full-width">Save</Button>
            <Button className="full-width">Data</Button>
            <Button className="full-width">Coupling</Button>
            <Button className="full-width">Sensors</Button>
          </Space>
        </Collapse.Panel>
      </Collapse>
    </>
  )
}

export default Blobs
