/**
 * NumberHelper
 * @param {number} number Number
 * @returns {number} Formated number
 */
const NumberHelper = (number) => {
  const minThreshold = 1e-12

  if (number < minThreshold) return 0
  if (Math.abs(number) > 1000 || Math.abs(number) < 0.001)
    return number.toExponential(2)
  return number.toFixed(3)
}

export default NumberHelper
