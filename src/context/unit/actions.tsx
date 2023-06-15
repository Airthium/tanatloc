/** @module Context.Unit.Actions */

import { IUnitAction, TSystem, actionTypes } from '.'

/**
 * Set
 * @param system System
 */
export const set = (system?: TSystem): IUnitAction => {
  return { type: actionTypes.SET, value: system }
}
