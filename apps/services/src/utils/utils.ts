export function standardizeNumber (number: string) {
  number = number.replace(/( )/g, '')
  if (number.includes('_') || number.includes('-')) {
    number = number.replace(/\_/g, '')
    // number = number.replace(/\+/, '')
    number = number.replace(/\-/g, '')
  }
  if (!number.includes('+84') && !number.includes('+1')) {
    number = number.replace(/\+/g, '')
    number = '+84' + number
  }
  return number
}