/**
 * Validates a Brazilian CPF (Cadastro de Pessoas Físicas).
 *
 * The CPF is a unique identifier for Brazilian individuals, and it follows a specific format
 * with 11 digits. This function checks the validity of a given CPF string by verifying its
 * length, ensuring it doesn't consist of repeated digits, and calculating its verification digits.
 *
 * @param {string} value - The CPF string to be validated. It can contain non-digit characters
 *                         which will be removed during validation.
 * @returns {boolean} - Returns true if the CPF is valid, otherwise false.
 *
 * @example
 * // Valid CPF
 * console.log(cpfValidator('123.456.789-09')); // true
 *
 * // Invalid CPF
 * console.log(cpfValidator('123.456.789-00')); // false
 */
export function brazilianCpfValidator(value: string): boolean {
  const cpf = value.replace(/\D/g, '')

  if (cpf.length !== 11) return false

  if (/^(\d)\1+$/.test(cpf)) return false

  const calculateDigit = (cpf: string, factor: number): number => {
    let sum = 0
    for (let i = 0; i < cpf.length; i++) {
      sum += parseInt(cpf.charAt(i)) * factor--
    }
    const result = sum % 11
    return result < 2 ? 0 : 11 - result
  }

  const firstNineDigits = cpf.substring(0, 9)
  const firstDigit = calculateDigit(firstNineDigits, 10)
  if (firstDigit !== parseInt(cpf.charAt(9))) return false

  const firstTenDigits = cpf.substring(0, 10)
  const secondDigit = calculateDigit(firstTenDigits, 11)
  if (secondDigit !== parseInt(cpf.charAt(10))) return false

  return true
}

/**
 * Validates a Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica).
 *
 * The CNPJ is a unique identifier for Brazilian companies, and it follows a specific format
 * with 14 digits. This function checks the validity of a given CNPJ string by verifying its
 * length, ensuring it doesn't consist of repeated digits, and calculating its verification digits.
 *
 * @param {string} value - The CNPJ string to be validated. It can contain non-digit characters
 *                         which will be removed during validation.
 * @returns {boolean} - Returns true if the CNPJ is valid, otherwise false.
 *
 * @example
 * // Valid CNPJ
 * console.log(cnpjValidator('12.345.678/0001-95')); // true
 *
 * // Invalid CNPJ
 * console.log(cnpjValidator('12.345.678/0001-96')); // false
 */
export function brazilianCnpjValidator(value: string): boolean {
  const cnpj = value.replace(/[^\d]+/g, '')

  if (cnpj.length !== 14) return false

  if (/^(\d)\1+$/.test(cnpj)) return false

  const calculateDigit = (cnpj: string, length: number): number => {
    let sum = 0
    let position = length - 7

    for (let i = length; i >= 1; i--) {
      sum += parseInt(cnpj.charAt(length - i)) * position--
      if (position < 2) position = 9
    }

    const result = 11 - (sum % 11)
    return result > 9 ? 0 : result
  }

  const baseCnpj = cnpj.substring(0, 12)
  const digit1 = calculateDigit(baseCnpj, 12)
  const digit2 = calculateDigit(cnpj.substring(0, 13), 13)

  return (
    digit1 === parseInt(cnpj.charAt(12)) && digit2 === parseInt(cnpj.charAt(13))
  )
}

/**
 * Validates an email address using a regular expression.
 *
 * This function checks the validity of a given email string by matching it
 * against a regular expression that covers common email formats.
 *
 * @param {string} email - The email string to be validated.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 *
 * @example
 * // Valid email
 * console.log(emailValidation('example@example.com')); // true
 *
 * // Invalid email
 * console.log(emailValidation('example@com')); // false
 */
export const emailIsValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[A-Za-z]{2,24}$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Checks if a name string is valid.
 *
 * This function verifies if the given name string is valid by checking three conditions:
 * 1. The last character should not be a space.
 * 2. The name should contain at least two words.
 * 3. The name should not be empty.
 *
 * @param {string} name - The name string to be validated.
 * @returns {boolean} - True if the name is valid, otherwise false.
 *
 * @example
 * // Valid name
 * console.log(nameIsValid('John Doe')); // true
 *
 * // Invalid name (last character is space)
 * console.log(nameIsValid('John ')); // false
 *
 * // Invalid name (only one word)
 * console.log(nameIsValid('John')); // false
 *
 * // Invalid name (empty string)
 * console.log(nameIsValid('')); // false
 */
export const nameIsValid = (name: string): boolean => {
  const lastCharacterIsEmpty = name.endsWith(' ')
  const nameIsIncomplete = name.trim().split(' ').length < 2
  const nameIsEmpty = name.length === 0

  return !(lastCharacterIsEmpty || nameIsIncomplete || nameIsEmpty)
}

export interface ValidationResult {
  valid: boolean
  message: string
}

/**
 * Validates a full name string to ensure it has at least a first name and a last name,
 * contains only alphabetic characters, and does not have multiple consecutive spaces.
 *
 * @param {string} name - The full name string to validate.
 * @returns {ValidationResult} - An object indicating if the name is valid and an error message if not.
 *
 * @example
 * // Valid full name
 * console.log(fullnameValidation('John Doe')); // { valid: true, message: '' }
 *
 * // Invalid full name (extra spaces)
 * console.log(fullnameValidation('John  Doe')); // { valid: false, message: 'No extra spaces allowed' }
 *
 * // Invalid full name (single name)
 * console.log(fullnameValidation('John')); // { valid: false, message: 'Name should include first and last name' }
 *
 * // Invalid full name (non-alphabetic characters)
 * console.log(fullnameValidation('John Doe1')); // { valid: false, message: 'Only alphabetic characters are allowed' }
 */
export function fullnameIsValid(name: string): ValidationResult {
  const nameTrimmed = name.trim()

  if (/\s{2,}/.test(nameTrimmed)) {
    return {
      valid: false,
      message: 'No extra spaces allowed',
    }
  }

  const nameParts = nameTrimmed.split(' ')

  if (nameParts.length < 2) {
    return {
      valid: false,
      message: 'Name should include first and last name',
    }
  }

  for (const part of nameParts) {
    if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+$/.test(part)) {
      return {
        valid: false,
        message: 'Only alphabetic characters are allowed',
      }
    }
  }

  return {
    valid: true,
    message: '',
  }
}

/**
 * Validates if the given string contains a valid first name and last name.
 *
 * This function checks if the given name string consists of a valid first name and last name,
 * allowing for spaces, hyphens, and apostrophes.
 *
 * @param {string} name - The name string to be validated.
 * @returns {boolean} - True if the name is valid, otherwise false.
 *
 * @example
 * // Valid name
 * console.log(validNameAndLastName('John Doe')); // true
 *
 * // Invalid name (only first name)
 * console.log(validNameAndLastName('John')); // false
 *
 * // Valid name with hyphen
 * console.log(validNameAndLastName('Mary-Jane Smith')); // true
 *
 * // Valid name with apostrophe
 * console.log(validNameAndLastName("O'Connor")); // true
 */
export const validNameAndLastName = (name: string): boolean => {
  const regex = /^[a-zA-ZÀ-ÿ]+([-\s'][a-zA-ZÀ-ÿ]+)+$/
  return regex.test(name)
}

/**
 * Validates a Brazilian telephone number using a regular expression.
 *
 * This function checks the validity of a given telephone string by matching it
 * against a regular expression that covers common telephone formats in Brazil.
 *
 * @param {string} telephone - The telephone string to be validated.
 * @returns {boolean} - Returns true if the telephone number is valid, otherwise false.
 *
 * @example
 * // Valid telephone numbers
 * console.log(telephoneValidator('+55 (21) 98765-4321')); // true
 * console.log(telephoneValidator('021987654321')); // true
 *
 * // Invalid telephone numbers
 * console.log(telephoneValidator('123456')); // false
 * console.log(telephoneValidator('abcd-efgh')); // false
 */
export function brazilianTelephoneValidator(telephone: string): boolean {
  const telephoneRegex =
    /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/
  return telephoneRegex.test(telephone)
}

/**
 * Checks if the given birthdate corresponds to an age of 18 or older.
 *
 * This function validates the given birthdate string and checks if the age is 18 or older,
 * considering the current date. It supports birthdate formats 'YYYY-MM-DD' and 'DD/MM/YYYY'.
 *
 * @param {string} birthday - The birthdate string in 'YYYY-MM-DD' or 'DD/MM/YYYY' format.
 * @param {boolean} allowMinors - Flag to allow minors (under 18).
 * @returns {boolean} - True if the age is 18 or older, otherwise false.
 *
 * @example
 * // Check if a birthdate is 18 or older in 'YYYY-MM-DD' format
 * console.log(birthdateIs18Plus('2000-01-01', false)); // true or false depending on the current date
 *
 * // Check if a birthdate is 18 or older in 'DD/MM/YYYY' format
 * console.log(birthdateIs18Plus('01/01/2000', false)); // true or false depending on the current date
 */
export const birthdateIs18Plus = (
  birthday: string,
  allowMinors: boolean
): boolean => {
  let day: number, month: number, year: number

  if (birthday.includes('-')) {
    // Format 'YYYY-MM-DD'
    ;[year, month, day] = birthday.split('-').map(Number)
  } else if (birthday.includes('/')) {
    // Format 'DD/MM/YYYY'
    ;[day, month, year] = birthday.split('/').map(Number)
  } else {
    // Invalid format
    return false
  }

  const today = new Date()
  const birthDate = new Date(year, month - 1, day)
  const age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()
  const dayDifference = today.getDate() - birthDate.getDate()

  const is18OrOlder =
    age > 18 ||
    (age === 18 &&
      (monthDifference > 0 || (monthDifference === 0 && dayDifference >= 0)))

  if (allowMinors) {
    return age >= 0 && age < 105
  }

  return is18OrOlder && age < 105
}

export interface PasswordPayload {
  passwordIsValid: boolean
  errors?: string[]
}

/**
 * Validates a password based on specific security criteria.
 *
 * This function checks if the given password meets the following criteria:
 * - At least 8 characters long
 * - Contains at least one number
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 *
 * @param {string} password - The password string to be validated.
 * @returns {PasswordPayload} - An object indicating if the password is valid and any validation errors.
 *
 * @example
 * // Valid password
 * console.log(passwordValidator('StrongP@ssword1')); // { passwordIsValid: true }
 *
 * // Invalid password
 * console.log(passwordValidator('weak')); // { passwordIsValid: false, errors: ['passwordLength', 'noNumber', 'noUpperCaseLetter'] }
 */
export function passwordStrongValidator(password: string): PasswordPayload {
  const passwordLength = password.length >= 8
  const passwordHasNumber = /(?=.*[0-9])/.test(password)
  const passwordHasUpperCaseLetter = /(?=.*[A-Z])/.test(password)
  const passwordHasLowerCaseLetter = /(?=.*[a-z])/.test(password)

  const errors: string[] = []

  if (!passwordLength) errors.push('passwordLength')
  if (!passwordHasNumber) errors.push('noNumber')
  if (!passwordHasUpperCaseLetter) errors.push('noUpperCaseLetter')
  if (!passwordHasLowerCaseLetter) errors.push('noLowerCaseLetter')

  if (errors.length) {
    return { passwordIsValid: false, errors }
  }

  return { passwordIsValid: true }
}
