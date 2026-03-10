import { parsePhoneNumberFromString } from 'libphonenumber-js';

export class PhoneValidator {
  /**
   * Validates a phone number against E.164 standards.
   * @param phone - Raw input string.
   * @param defaultCountry - Two-letter country code (e.g., 'ZA' for South Africa).
   */
  static validate(phone: string, defaultCountry: any = 'ZA') {
    const phoneNumber = parsePhoneNumberFromString(phone || '', defaultCountry);

    if (phoneNumber && phoneNumber.isValid()) {
      return {
        isValid: true,
        formatted: phoneNumber.formatInternational(),
        country: phoneNumber.country,
        type: phoneNumber.getType() // Useful for filtering mobile vs landline
      };
    }

    return {
      isValid: false,
      formatted: null,
      country: null,
      type: null
    };
  }
}
