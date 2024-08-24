import * as z from "zod";

function zCheckbox(options: {
  required: true
}): z.ZodEffects<z.ZodBoolean, true>
function zCheckbox(options?: {
  required?: true
}): z.ZodBoolean
function zCheckbox(options?: {
  required?: true
}): z.ZodBoolean | z.ZodEffects<z.ZodBoolean, boolean>{
  if (options && options.required)
    return z
      .boolean({ message: "invalid" })
      .refine(val => !!val, "required");
  else
    return z
      .boolean({ message: "invalid" })
}

export {
  zCheckbox
}