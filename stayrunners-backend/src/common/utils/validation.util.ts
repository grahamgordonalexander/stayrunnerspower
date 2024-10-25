// src/common/utils/validation.util.ts
export class ValidationUtils {
  static isValidLocation(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  static isValidPrice(price: number): boolean {
    return price > 0 && Number.isFinite(price);
  }

  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  }
}
