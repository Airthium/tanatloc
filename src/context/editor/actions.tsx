/** @module Context.Editor.Actions */

import { actionTypes, IEditorAction, IEditorCursor } from '.'

export const setTemplate = (template: string): IEditorAction => {
  return { type: actionTypes.SETTEMPLATE, value: template }
}

export const setModel = (model: string): IEditorAction => {
  return { type: actionTypes.SETMODEL, value: model }
}

export const setCursor = (cursor: IEditorCursor): IEditorAction => {
  return { type: actionTypes.SETCURSOR, value: cursor }
}

export const setTemplateValid = (valid: boolean): IEditorAction => {
  return { type: actionTypes.SETTEMPLATEVALID, value: valid }
}

export const setModelValid = (valid: boolean): IEditorAction => {
  return { type: actionTypes.SETMODELVALID, value: valid }
}
