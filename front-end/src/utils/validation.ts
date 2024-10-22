export const isValidName = (name: string): boolean => {
  const regex = /^[a-zA-Z\s'-]+$/;
  return name.trim().length > 0 && regex.test(name);
};

export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export function isValidPrice(value: string) {
  // Regular expression to check if the value is a valid price
  const priceRegex = /^\d+(\.\d{1,2})?$/;

  // Convert the value to a string and test against the regular expression
  return priceRegex.test(String(value));
}

export function isNumber(value: string) {
  const pattern = /^[0-9]+$/;
  return pattern.test(value);
}

export const isEmpty = (value: string) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);




export function validatePassword(password:string) {
    return password.length >= 8;
}