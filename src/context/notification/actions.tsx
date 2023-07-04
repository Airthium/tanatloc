/** @module Context.Notification.Actions */

import { IErrorItem, ISuccessItem, actionTypes } from '.'

export const addSuccess = (success: ISuccessItem) => ({
  type: actionTypes.ADDSUCCESS,
  value: success
})

export const removeSuccess = (success: ISuccessItem) => ({
  type: actionTypes.REMOVESUCCESS,
  value: success
})

export const addError = (error: IErrorItem) => ({
  type: actionTypes.ADDERROR,
  value: error
})

export const removeError = (error: IErrorItem) => ({
  type: actionTypes.REMOVEERROR,
  value: error
})
