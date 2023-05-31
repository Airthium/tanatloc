/** @module Context.Editor.Actions */

import {
  actionTypes,
  IEditorAction,
  IEditorCursor,
  IEditorError,
  IEditorHighlight
} from '.'

export const setId = (id: string): IEditorAction => {
  return { type: actionTypes.SETID, value: id }
}

export const setTemplate = (template: string): IEditorAction => {
  return { type: actionTypes.SETTEMPLATE, value: template }
}

export const setModel = (model: string): IEditorAction => {
  return { type: actionTypes.SETMODEL, value: model }
}

export const setJsonHighlight = (
  highlight: IEditorHighlight
): IEditorAction => {
  return { type: actionTypes.SETJSONHIGHLIGHT, value: highlight }
}

export const setTemplateHighlight = (
  highlight: IEditorHighlight
): IEditorAction => {
  return { type: actionTypes.SETTEMPLATEHIGHLIGHT, value: highlight }
}

export const setJsonCursor = (cursor: IEditorCursor): IEditorAction => {
  return { type: actionTypes.SETJSONCURSOR, value: cursor }
}

export const setTemplateCursor = (cursor: IEditorCursor): IEditorAction => {
  return { type: actionTypes.SETTEMPLATECURSOR, value: cursor }
}

export const setJsonError = (error?: IEditorError): IEditorAction => {
  return { type: actionTypes.SETJSONERROR, value: error }
}

export const setTemplateError = (error?: IEditorError): IEditorAction => {
  return { type: actionTypes.SETTEMPLATEERROR, value: error }
}

export const setTemplateValid = (valid: boolean): IEditorAction => {
  return { type: actionTypes.SETTEMPLATEVALID, value: valid }
}

export const setModelValid = (valid: boolean): IEditorAction => {
  return { type: actionTypes.SETMODELVALID, value: valid }
}
