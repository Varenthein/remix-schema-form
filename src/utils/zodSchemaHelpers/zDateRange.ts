import { z } from "zod"
import { zDate } from "./zDate"

function zDateRange(options?: {
  required: true,
  minDate?: Date,
  maxDate?: Date
}): z.ZodEffects<z.ZodObject<{ start: z.ZodPipeline<z.ZodEffects<z.ZodString, Date, string>, z.ZodEffects<z.ZodEffects<z.ZodDate, Date, Date>, Date, Date>>; end: z.ZodPipeline<z.ZodEffects<z.ZodString, Date, string>, z.ZodEffects<z.ZodEffects<z.ZodDate, Date, Date>, Date, Date>>; }>>
function zDateRange(options?: {
  required?: Boolean,
  minDate?: Date,
  maxDate?: Date
}): z.ZodUnion<[z.ZodEffects<z.ZodObject<{ start: z.ZodPipeline<z.ZodEffects<z.ZodString, Date, string>, z.ZodEffects<z.ZodEffects<z.ZodDate, Date, Date>, Date, Date>>; end: z.ZodPipeline<z.ZodEffects<z.ZodString, Date, string>, z.ZodEffects<z.ZodEffects<z.ZodDate, Date, Date>, Date, Date>>; }>>, z.ZodUndefined]> 
function zDateRange(options?: {
  required?: Boolean,
  minDate?: Date,
  maxDate?: Date
}): z.ZodEffects<z.ZodObject<{ start: z.ZodPipeline<z.ZodEffects<z.ZodString, Date, string>, z.ZodEffects<z.ZodEffects<z.ZodDate, Date, Date>, Date, Date>>; end: z.ZodPipeline<z.ZodEffects<z.ZodString, Date, string>, z.ZodEffects<z.ZodEffects<z.ZodDate, Date, Date>, Date, Date>>; }>> |
    z.ZodUnion<[z.ZodEffects<z.ZodObject<{ start: z.ZodPipeline<z.ZodEffects<z.ZodString, Date, string>, z.ZodEffects<z.ZodEffects<z.ZodDate, Date, Date>, Date, Date>>; end: z.ZodPipeline<z.ZodEffects<z.ZodString, Date, string>, z.ZodEffects<z.ZodEffects<z.ZodDate, Date, Date>, Date, Date>>; }>>, z.ZodUndefined]> 
{
  if (options && options.required)
    return z
      .object({
        start: zDate({ ...options, required: true }),
        end: zDate({ ...options, required: true }),
      }, { message: "invalid" })
      .refine(val => new Date(val.start) <= new Date(val.end), "dateRangeInvalid")
  else
    return z
      .object({
        start: options ? zDate({ ...options, required: true }) : zDate({ required: true }),
        end: options ? zDate({ ...options, required: true }) : zDate({ required: true })
      })
      .refine(val => new Date(val.start) <= new Date(val.end), "dateRangeInvalid")
      .or(z.undefined({ message: "invalid" }))
}

export {
  zDateRange
}