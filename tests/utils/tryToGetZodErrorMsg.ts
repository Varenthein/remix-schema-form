import { ZodError } from "zod";

export const tryToGetZodErrorMsg = (cb: () => void) => {
  try {
    cb();
    return null;
  } catch (err) {
    if (err instanceof ZodError)
      return JSON.parse(err.message)[0].message
    else
      return err
  }
}