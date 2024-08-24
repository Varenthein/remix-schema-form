import * as z from "zod";
import { isFilesArray } from "../isFilesArray";
import { MimeType } from "./zFile";

function zFiles(options?: {
  minAmount: number,
  maxAmount?: number,
  accept?: MimeType[],
  maxSize?: number
}): z.ZodEffects<z.ZodType<File[]>>
function zFiles(options?: {
  minAmount?: number,
  maxAmount?: number,
  accept?: MimeType[],
  maxSize?: number
}): z.ZodEffects<z.ZodType<File[] | undefined>>
function zFiles(options?: {
  minAmount?: number,
  maxAmount?: number,
  accept?: MimeType[],
  maxSize?: number
}): z.ZodEffects<z.ZodType<File[] | undefined>> {
  return options && options.minAmount
    ?
      z.custom<File[]>(val => isFilesArray(val), "invalid")
        .refine(files => files.length >= options.minAmount!, options.minAmount ? "tooFewElements|min=" + options.minAmount : "")
        .refine(files => typeof options.maxAmount === "undefined" || files.length <= options.maxAmount, options.maxAmount ? "tooManyElements|max=" + options.maxAmount : "")
        .refine(files => !files.length || typeof options.maxSize === "undefined" || [...files].every(file => file.size <= options.maxSize!), options.maxSize ? `fileIsTooBig|max=${options.maxSize / 1024 / 1024}` : "")
        .refine(files => !files.length || typeof options.accept === "undefined" || [...files].every(file => options.accept!.includes(file.type)), options.accept ? `unsupportedFormat|formats=${options.accept.map(i => i.split("/")[1]).join(", ")}` : "")
    :
      z.custom<File[] | undefined>(val => isFilesArray(val) || typeof val === "undefined", "invalid") 
        .refine(files => !files || !options || typeof options.maxAmount === "undefined" || files.length <= options.maxAmount, options?.maxAmount ? "tooManyElements|max=" + options.maxAmount : "")
        .refine(files => !files || !files.length || !options || typeof options.maxSize === "undefined" || [...files].every(file => file.size <= options.maxSize!), options?.maxSize ? `fileIsTooBig|max=${options.maxSize / 1024 / 1024}` : "")
        .refine(files => !files || !files.length || !options || typeof options.accept === "undefined" || [...files].every(file => options.accept!.includes(file.type)), options?.accept ? `unsupportedFormat|formats=${options.accept!.map(i => i.split("/")[1]).join(", ")}` : "")
}
    
export {
  zFiles
}
