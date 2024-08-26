import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

/**
 * Convert string error with payload to object
 * e.g "maxLength|max=5" -> { message: "maxLength", values: { max: "5" } }
 * @param error string
 * @returns
 */
export const prepareValidationError = (
  errorObj: FieldError | Merge<FieldError, FieldErrorsImpl<any>>
): {
  message: string;
  values?: Record<string, string>;
} => {
  const getErrorMessage = (
    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>>
  ) => {
    // if there is no error.message/type/types/ref, we probably have an error in some nested structure
    // the error surely points to something deeper
    // it may be a problem in more than one field, but we will try show the first one that find
    // Disclaimer: if no message, but also no nested properties exist whatsoever -> just return empty string
    if (!error.message && !error.type && !error.types && !error.ref) {
      const objPropertiesKeys = Object.keys(error);
      if (!objPropertiesKeys.length) return "";

      const firstPropertyKey = objPropertiesKeys[0] as keyof typeof error;
      return getErrorMessage(
        error[firstPropertyKey] as
          | FieldError
          | Merge<FieldError, FieldErrorsImpl<any>>
      );
    }

    // if message exists and is a string -> just return it as it is
    if (error.message && typeof error.message === "string")
      return error.message;

    // in any other cases, there is something clearly wrong
    // as no other options are supported
    // so... -> return empty string
    return "";
  };

  const error = getErrorMessage(errorObj);
  const [message, rest] = error.split("|");

  if (!message)
    return {
      message: "",
    }

  if (!rest)
    return {
      // There is one default message which zod can give us: Required
      // It's capitalized so it doesn't match i18n key name convention
      // If encourage this error, convert to proper format ("required")
      message: message === "Required" ? "required" : message,
    };

  const values = rest
    .split("|")
    .map((val) => {
      const [key, value] = val.split("=");
      if (key === undefined || value === undefined) return undefined;

      return {
        [key]: value,
      };
    })
    .reduce((acc, val) => {
      if (val !== undefined) return { ...acc, ...val };
      return acc;
    }, {} as any)

  return {
    message,
    values,
  };
};
