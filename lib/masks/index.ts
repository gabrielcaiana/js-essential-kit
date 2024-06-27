import { countries } from '../utils/countries'

/**
 * Applies a mask to a given value as CPF or CNPJ.
 *
 * This function formats the input value as a CPF (xxx.xxx.xxx-xx) or CNPJ (xx.xxx.xxx/xxxx-xx)
 * depending on the length of the numeric input.
 *
 * @param {string} value - The value to be formatted, containing only digits.
 * @returns {string} - The formatted value with CPF or CNPJ mask applied.
 *
 * @example
 * // Apply CPF mask
 * console.log(cpfCnpjMask('12345678909')); // '123.456.789-09'
 *
 * // Apply CNPJ mask
 * console.log(cpfCnpjMask('12345678000195')); // '12.345.678/0001-95'
 */
export function cpfOrCnpjMask(value: string): string {
  value = value.replace(/\D/g, '')

  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else {
    value = value.replace(/^(\d{2})(\d)/, '$1.$2')
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
    value = value.replace(/(\d{4})(\d)/, '$1-$2')
  }

  return value
}

/**
 * Applies a mask to a Brazilian CEP (Postal Code).
 *
 * This function formats the input value as a CEP (xxxxx-xxx) by removing any non-digit characters
 * and applying the appropriate mask.
 *
 * @param {string} value - The value to be formatted, containing only digits.
 * @returns {string} - The formatted value with CEP mask applied.
 *
 * @example
 * // Apply CEP mask
 * console.log(cepMask('12345678')); // '12345-678'
 */
export function brazilianZipcodeMask(value: string): string {
  value = value.replace(/\D/g, '')
  value = value.replace(/^(\d{5})(\d)/, '$1-$2')

  return value
}

/**
 * Applies a mask to a Brazilian telephone number.
 *
 * This function formats the input value as a Brazilian telephone number, handling
 * both 8-digit and 9-digit phone numbers correctly.
 *
 * @param {string} value - The value to be formatted, containing only digits.
 * @returns {string} - The formatted telephone number.
 *
 * @example
 * // Apply telephone mask to 8-digit number
 * console.log(telephoneMask('1123456789')); // '(11) 2345-6789'
 *
 * // Apply telephone mask to 9-digit number
 * console.log(telephoneMask('11987654321')); // '(11) 98765-4321'
 */
export function brasilianTelephoneMask(value: string): string {
  value = value.replace(/\D/g, '')

  if (value.length <= 10) {
    value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  } else {
    value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }

  return value
}

/**
 * Applies a mask to a phone number based on the country code.
 *
 * This function finds the appropriate mask for the given country code and applies it
 * to the provided phone number. If no mask is found for the country, the original
 * phone number is returned.
 *
 * @param {string} country - The country code (e.g., 'US', 'BR').
 * @param {string} phoneNumber - The phone number to be masked.
 * @returns {string} - The masked phone number.
 *
 * @example
 * // Mask a US phone number
 * console.log(cellphoneMask('US', '1234567890')); // '(123) 456-7890'
 *
 * // Mask a Brazilian phone number
 * console.log(cellphoneMask('BR', '11987654321')); // '(11) 98765-4321'
 */
export const globalCellphoneMask = (
  country: string,
  phoneNumber: string
): string => {
  const selectCountry = countries.find((item) => item.code === country)
  const mask = selectCountry?.mask
  if (!mask) {
    return phoneNumber
  }

  const digits = phoneNumber.replace(/\D/g, '')
  let result = ''
  let digitIndex = 0

  for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
    if (mask[i] === '9') {
      result += digits[digitIndex++]
    } else {
      result += mask[i]
    }
  }

  return result
}

/**
 * Removes all non-digit characters from the input string.
 *
 * This function is used to clear any mask or formatting from a string,
 * leaving only the numeric characters.
 *
 * @param {string} value - The string from which to remove non-digit characters.
 * @returns {string} - The cleaned string containing only digits.
 *
 * @example
 * // Clear mask from CPF
 * console.log(clearMask('123.456.789-09')); // '12345678909'
 *
 * // Clear mask from CNPJ
 * console.log(clearMask('12.345.678/0001-95')); // '12345678000195'
 *
 * // Clear mask from phone number
 * console.log(clearMask('+55 (21) 98765-4321')); // '5521987654321'
 */
export function clearMask(value: string): string {
  return value.replace(/\D/g, '')
}
