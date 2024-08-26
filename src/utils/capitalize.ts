/**
 * Capitalize given string.
 * @param str
 * @returns Capitalized string
 * @example capitalize("john"); // "John"
 */
export const capitalize = (str: string): string =>
  str.length > 0 ? str[0]!.toUpperCase() + str.slice(1) : str;
