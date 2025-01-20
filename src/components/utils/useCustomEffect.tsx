/** @module Components.Utils.useCustomEffect */

import { useEffect, useRef } from 'react'

import { arrayCompare } from './compare'

/**
 * UseEffect with custom updaters and dependencies
 * @param callback Callback
 * @param updaters Updaters
 * @param dependencies Dependencies
 */
const useCustomEffect = (
  callback: () => any,
  updaters?: any[],
  dependencies?: any[]
): void => {
  // Ref
  const updatersRef = useRef<any[]>(undefined)

  // Effect
  useEffect(() => {
    if (
      !updatersRef.current?.length ||
      !arrayCompare(updatersRef.current, updaters)
    ) {
      updatersRef.current = [...(updaters ?? [true])]
      return callback()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(updaters ?? []), ...(dependencies ?? []), callback])
}

export default useCustomEffect
