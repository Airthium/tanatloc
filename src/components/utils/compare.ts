/** @module Components.Utils.Compare */

/**
 * Compare array
 * @param array1 Array 1
 * @param array2 Array 2
 * @returns Same
 */
export const arrayCompare = (array1?: any[], array2?: any[]): boolean => {
  if (!array1 || !array2) return false

  const length1 = array1.length
  const length2 = array2.length

  if (length1 !== length2) return false

  return array1.every((value1, index) => {
    const value2 = array2[index]
    if (Array.isArray(value1)) return arrayCompare(value1, value2)
    else if (typeof value1 === 'object') return objectCompare(value1, value2)
    else return value1 === value2
  })
}

/**
 * Compare object
 * @param object1 Object 1
 * @param object2 Object 2
 * @returns Same
 */
export const objectCompare = (object1?: any, object2?: any) => {
  if (!object1 || !object2) return false

  return JSON.stringify(object1) === JSON.stringify(object2)
}
