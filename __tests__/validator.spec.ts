import {
  brazilianCpfValidator,
  brazilianCnpjValidator,
  emailIsValid,
  nameIsValid,
  fullnameIsValid,
  validNameAndLastName,
  brazilianTelephoneValidator,
  birthdateIs18Plus,
  passwordStrongValidator,
} from '../lib/validators'

describe('brazilianCpfValidator', () => {
  test('Valid CPF', () => {
    expect(brazilianCpfValidator('123.456.789-09')).toBe(true)
  })

  test('Invalid CPF', () => {
    expect(brazilianCpfValidator('123.456.789-00')).toBe(false)
  })
})

describe('brazilianCnpjValidator', () => {
  test('Valid CNPJ', () => {
    expect(brazilianCnpjValidator('12.345.678/0001-95')).toBe(true)
  })

  test('Invalid CNPJ', () => {
    expect(brazilianCnpjValidator('12.345.678/0001-96')).toBe(false)
  })
})

describe('emailIsValid', () => {
  test('Valid email', () => {
    expect(emailIsValid('example@example.com')).toBe(true)
  })

  test('Invalid email', () => {
    expect(emailIsValid('example@com')).toBe(false)
  })
})

describe('nameIsValid', () => {
  test('valid name', () => {
    expect(nameIsValid('John Doe')).toBe(true)
  })

  test('invalid name (last character is space)', () => {
    expect(nameIsValid('John ')).toBe(false)
  })

  test('invalid name (only one word)', () => {
    expect(nameIsValid('John')).toBe(false)
  })

  test('invalid name (empty string)', () => {
    expect(nameIsValid('')).toBe(false)
  })
})

describe('fullnameIsValid', () => {
  test('valid full name', () => {
    expect(fullnameIsValid('John Doe')).toEqual({ valid: true, message: '' })
  })

  test('invalid full name (extra spaces)', () => {
    expect(fullnameIsValid('John  Doe')).toEqual({
      valid: false,
      message: 'No extra spaces allowed',
    })
  })

  test('invalid full name (single name)', () => {
    expect(fullnameIsValid('John')).toEqual({
      valid: false,
      message: 'Name should include first and last name',
    })
  })

  test('invalid full name (non-alphabetic characters)', () => {
    expect(fullnameIsValid('John Doe1')).toEqual({
      valid: false,
      message: 'Only alphabetic characters are allowed',
    })
  })
})

describe('validNameAndLastName', () => {
  test('valid name', () => {
    expect(validNameAndLastName('John Doe')).toBe(true)
  })

  test('invalid name (only first name)', () => {
    expect(validNameAndLastName('John')).toBe(false)
  })

  test('valid name with hyphen', () => {
    expect(validNameAndLastName('Mary-Jane Smith')).toBe(true)
  })

  test('valid name with apostrophe', () => {
    expect(validNameAndLastName("O'Connor")).toBe(true)
  })
})

describe('brazilianTelephoneValidator', () => {
  test('valid telephone numbers', () => {
    expect(brazilianTelephoneValidator('+55 (21) 98765-4321')).toBe(true)
  })

  test('invalid telephone numbers', () => {
    expect(brazilianTelephoneValidator('123456')).toBe(false)
    expect(brazilianTelephoneValidator('abcd-efgh')).toBe(false)
  })
})

describe('birthdateIs18Plus', () => {
  test('check if a birthdate is 18 or older', () => {
    const currentDate = new Date()
    const eighteenYearsAgo = new Date()
    eighteenYearsAgo.setFullYear(currentDate.getFullYear() - 18)

    const birthDateString = `${eighteenYearsAgo.getFullYear()}-${String(
      eighteenYearsAgo.getMonth() + 1
    ).padStart(2, '0')}-${String(eighteenYearsAgo.getDate()).padStart(2, '0')}`

    expect(birthdateIs18Plus(birthDateString, false)).toBe(true)
  })

  test('allow minors', () => {
    expect(birthdateIs18Plus('2010-01-01', true)).toBe(true)
  })

  test('disallow minors', () => {
    expect(birthdateIs18Plus('2010-01-01', false)).toBe(false)
  })
})

describe('passwordStrongValidator', () => {
  test('valid password', () => {
    expect(passwordStrongValidator('StrongP@ssword1')).toEqual({
      passwordIsValid: true,
    })
  })
})
