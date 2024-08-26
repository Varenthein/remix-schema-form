import parsePhoneNumber from "libphonenumber-js";
import * as z from "zod";

export const zPhone = z
  .string({ message: "invalid" })
  .transform((value, ctx) => {
    const phoneNumber = parsePhoneNumber(value, {
      defaultCountry: "US",
    });

    if (!phoneNumber?.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "invalidPhone",
      });
      return z.NEVER;
    }

    return phoneNumber.formatInternational();
  });
