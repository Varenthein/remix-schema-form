import * as z from "zod";
import { isFilesArray } from "../isFilesArray";

export type MimeType =
| 'application/x-abiword'
| 'application/x-freearc'
| 'video/x-msvideo'
| 'application/vnd.amazon.ebook'
| 'application/octet-stream'
| 'image/bmp'
| 'application/x-bzip'
| 'application/x-bzip2'
| 'application/x-csh'
| 'text/css'
| 'text/csv'
| 'application/msword'
| 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
| 'application/vnd.ms-fontobject'
| 'application/epub+zip'
| 'application/gzip'
| 'image/gif'
| 'text/html'
| 'image/vnd.microsoft.icon'
| 'text/calendar'
| 'application/java-archive'
| 'audio/mpeg'
| 'video/mpeg'
| 'application/vnd.apple.installer+xml'
| 'application/vnd.oasis.opendocument.presentation'
| 'application/vnd.oasis.opendocument.spreadsheet'
| 'application/vnd.oasis.opendocument.text'
| 'audio/ogg'
| 'video/ogg'
| 'application/ogg'
| 'audio/opus'
| 'font/otf'
| 'image/png'
| 'application/pdf'
| 'application/php'
| 'application/vnd.ms-powerpoint'
| 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
| 'application/vnd.rar'
| 'application/rtf'
| 'application/x-sh'
| 'image/svg+xml'
| 'application/x-shockwave-flash'
| 'application/x-tar'
| 'image/tiff'
| 'video/mp2t'
| 'font/ttf'
| 'text/plain'
| 'application/vnd.visio'
| 'audio/wav'
| 'audio/webm'
| 'video/webm'
| 'image/webp'
| 'font/woff'
| 'font/woff2'
| 'application/xhtml+xml'
| 'application/vnd.ms-excel'
| 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
| 'application/xml'
| 'application/vnd.mozilla.xul+xml'
| 'application/zip'
| 'video/3gpp'
| 'video/3gpp2'
| 'application/x-7z-compressed'
| (string & {})

function zFile (options?: {
  required: true,
  accept?: MimeType[],
  maxSize?: number
}): z.ZodEffects<z.ZodType<File>>
function zFile (options?: {
  required?: Boolean,
  accept?: MimeType[],
  maxSize?: number
}): z.ZodUnion<[z.ZodType<undefined, z.ZodTypeDef, undefined>, z.ZodEffects<z.ZodEffects<z.ZodType<File>>>]>
function zFile (options?: {
  required?: Boolean,
  accept?: MimeType[],
  maxSize?: number
}): (z.ZodEffects<z.ZodType<File | File[]>>) | z.ZodUnion<[z.ZodType<undefined, z.ZodTypeDef, undefined>, z.ZodEffects<z.ZodEffects<z.ZodType<File[] | File>>>]> {

  if (options && options.required)
    return z
      .custom<File[]>(val => isFilesArray(val), "invalid")
      .refine(files => files.length === 1, "required")
      .refine(files => !files.length || !options || typeof options.maxSize === "undefined" || files[0].size <= options.maxSize, options.maxSize ? `fileIsTooBig|max=${options.maxSize / 1024 / 1024}` : "")
      .refine(files => !files.length || !options || typeof options.accept === "undefined" || options.accept.includes(files[0].type), options.accept ? `unsupportedFormat|formats=${options.accept.map(i => i.split("/")[1]).join(", ")}` : "")
      .transform(val => Array.isArray(val) ? val[0] : val)
  else
    return z.union([
      z
        .custom<undefined>(val => typeof val === "undefined", "invalid"),
      z
        .custom<File[]>(val => isFilesArray(val), "invalid")
        .refine(files => files.length < 2, "invalid")
        .refine(files => !options || !options.required || files.length, "required")
        .refine(files => !files.length || !options || typeof options.maxSize === "undefined" || files[0].size <= options.maxSize, options?.maxSize ? `fileIsTooBig|max=${options.maxSize / 1024 / 1024}` : "")
        .refine(files => !files.length || !options || typeof options.accept === "undefined" || options.accept.includes(files[0].type), options?.accept ? `unsupportedFormat|formats=${options.accept.map(i => i.split("/")[1]).join(", ")}` : "")
        .transform(val => Array.isArray(val) ? val[0] : val),
      ])
}
      

export {
  zFile
}

