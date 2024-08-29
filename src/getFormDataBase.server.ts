import {
  AnyFieldAdditionalValidators,
  AnyFieldServerValidators,
  AnyFormFieldsSchema,
  AnySchemaConditionals,
  CleanUpFunc,
  FileRemoveFunc,
} from "./utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createValidatorFromSchema } from "./utils/createValidatorFromSchema";
import { FieldErrors } from "react-hook-form";
import {
  json,
  TypedResponse,
  unstable_parseMultipartFormData,
  UploadHandler,
} from "@remix-run/node";
import { defaultFileUploadHandler } from "./utils/defaultFileUploadHandler.server";
import { removeFileDefault } from "./utils/removeFileDefault.server";
import { cleanUpFileFields } from "./utils/cleanUpFileFields.server";
import { additionalZodValidatorsForBasicFields } from "./config";
import { runAdditionalZodValidations } from "./utils/runAdditionalZodValidations";
import { runServerZodValidations } from "./utils/runServerZodValidations";
import { getErrorMessage } from "./utils/getErrorMessage";
import invariant from "invariant";
import { generateFormDataWithFiles } from "./utils/generateFormDataWithFiles";
import { parseFormData, validateFormData } from "remix-hook-form";
import { enhanceSchemaWithConditionals } from "./utils/enhanceSchemaWithConditionals";
/**
 * Get validated safe data or error.
 * @param request Request
 * @param schema Valid schema
 * @param options
 * @returns
 */
export async function getFormDataBase<
  Schema extends AnyFormFieldsSchema,
  Conditionals extends AnySchemaConditionals
>(
  request: Request,
  plainSchema: Schema,
  options?: {
    fileHandlers?: {
      upload: () => UploadHandler;
      remove: FileRemoveFunc;
    };
    cleanUpFunc?: CleanUpFunc;
    customAdditionalValidators?: AnyFieldAdditionalValidators;
    customServerValidators?: AnyFieldServerValidators;
  },
  schemaConditionals?: Conditionals
): Promise<
  | {
      data: {
        [k in keyof z.objectUtil.addQuestionMarks<
          z.baseObjectOutputType<{
            [K in keyof Schema]: K extends keyof Conditionals
              ? Schema[K]["validation"] | z.ZodUndefined
              : Schema[K]["validation"];
          }>,
          any
        >]: z.objectUtil.addQuestionMarks<
          z.baseObjectOutputType<{
            [K in keyof Schema]: K extends keyof Conditionals
              ? Schema[K]["validation"] | z.ZodUndefined
              : Schema[K]["validation"];
          }>,
          any
        >[k];
      };
      cleanUp: (data: Record<string, any>) => Promise<void>;
      error: null;
      createCustomError: (
        errors: Partial<
          Record<keyof Schema, string> & { root: string | string[] }
        >
      ) => Promise<
        TypedResponse<{
          errors:
            | FieldErrors<{
                [k in keyof z.objectUtil.addQuestionMarks<
                  z.baseObjectOutputType<{
                    [K in keyof Schema]: K extends keyof Conditionals
                      ? Schema[K]["validation"] | z.ZodUndefined
                      : Schema[K]["validation"];
                  }>,
                  any
                >]: z.objectUtil.addQuestionMarks<
                  z.baseObjectOutputType<{
                    [K in keyof Schema]: K extends keyof Conditionals
                      ? Schema[K]["validation"] | z.ZodUndefined
                      : Schema[K]["validation"];
                  }>,
                  any
                >[k];
              }>
            | undefined;
          defaultValues: Record<any, any>;
        }>
      >;
    }
  | {
      error: TypedResponse<{
        errors:
          | FieldErrors<{
              [k in keyof z.objectUtil.addQuestionMarks<
                z.baseObjectOutputType<{
                  [K in keyof Schema]: K extends keyof Conditionals
                    ? Schema[K]["validation"] | z.ZodUndefined
                    : Schema[K]["validation"];
                }>,
                any
              >]: z.objectUtil.addQuestionMarks<
                z.baseObjectOutputType<{
                  [K in keyof Schema]: K extends keyof Conditionals
                    ? Schema[K]["validation"] | z.ZodUndefined
                    : Schema[K]["validation"];
                }>,
                any
              >[k];
            }>
          | undefined;
        defaultValues: Record<any, any>;
      }>;
      cleanUp: null;
      data: null;
      createCustomError: null;
    }
> {
  // determine form type
  const headers = request.headers;
  const formType = headers.get("content-type")?.includes("multipart/form-data")
    ? "multipart/form-data"
    : "application/x-www-form-urlencoded";

  // prepare small function for parsing the formData depending on having or not having file fields
  // it expects that uploadHandler (if applies) can throw some error
  // so in that scenario we catch it and do not let throw "messy" error
  // instead we will take care of it like with any other global form error
  const getFormData = async () => {
    try {
      // get form data contents
      const fd =
        formType === "multipart/form-data"
          ? await unstable_parseMultipartFormData(
              request,
              options?.fileHandlers
                ? options.fileHandlers.upload()
                : defaultFileUploadHandler()
            )
          : await request.formData();

      // create new fd based on it, but without empty values
      const fdWithoutUndefinedValues = new FormData();
      for (const [key, value] of fd.entries())
        if (value !== "undefined") fdWithoutUndefinedValues.append(key, value);

      return fdWithoutUndefinedValues;
    } catch (e) {
      invariant(
        true,
        "Form data couldn't be properly parsed. It's likely problem with upload handler. Maybe the file size is too big? The original error is as follows: " +
          getErrorMessage(e)
      );
      return null;
    }
  };

  // get form data
  // if it fails -> return pretty global error
  type FormData = z.infer<typeof validator>;
  const formData = await getFormData();
  if (!formData)
    return {
      error: json({
        errors: {
          root: {
            message: "invalidFormData",
          },
        } as FieldErrors<{
          [k in keyof z.objectUtil.addQuestionMarks<
            z.baseObjectOutputType<{
              [K in keyof Schema]: Schema[K]["validation"];
            }>,
            any
          >]: z.objectUtil.addQuestionMarks<
            z.baseObjectOutputType<{
              [K in keyof Schema]: Schema[K]["validation"];
            }>,
            any
          >[k];
        }>,
        defaultValues: {},
      }),
      data: null,
      cleanUp: null,
      createCustomError: null,
    };

  // cleanUp func for removing files stored during the request
  // can be used if request goes wrong
  const cleanUp = async (data: Record<string, any>) => {
    await cleanUpFileFields(
      formData,
      options?.fileHandlers ? options.fileHandlers.remove : removeFileDefault
    );

    if (options?.cleanUpFunc) await options.cleanUpFunc(data);
  };

  // parse form data (deserialize)
  // ----------------------
  // if it's "multipart/form-data", we use custom func which is enhanced version of remix-hook-form "generateFormData"
  // why? original one doesn't support file objects, so files can be provided only as paths
  // we don't want limit the user as whole file object can be used for further cropping and so on
  // so our version supports both cases
  // ----------------------
  // if it's application/x-www-form-urlencoded" we can use original "generateFormData" func
  // as we do not need handle files anyway in that scenario
  // we don't have direct access to this func as it is not exposed
  // so we use "parseFormData", but for already loaded formData it runs only "generateFormData" anyway
  // so in that case "parseFormData" is just a middleware for running "generateFormData"
  const parsedData =
    formType === "multipart/form-data"
      ? generateFormDataWithFiles(formData)
      : ((await parseFormData(formData)) as object); // we don't have direct access to "generateFormData", hence we use parseFormData which runs it for us anyway

  // if schema conditionals provided, add them to proper schema fields
  // if not -> just use schema as it is
  const schema = schemaConditionals
    ? enhanceSchemaWithConditionals(plainSchema, schemaConditionals)
    : plainSchema;

  // create z validator from schema and create remix form object based on that
  // refine it with additional (multi-field) validation for basic fields and custom ones
  // refine it also with optional additional server-side only validation
  const validator = createValidatorFromSchema(schema, parsedData).superRefine(
    (fields, ctx) => {
      runAdditionalZodValidations(
        schema,
        fields,
        ctx,
        additionalZodValidatorsForBasicFields
      );
      options?.customAdditionalValidators &&
        runAdditionalZodValidations(
          schema,
          fields,
          ctx,
          options.customAdditionalValidators
        );
      options?.customServerValidators &&
        runServerZodValidations(
          request,
          schema,
          fields,
          ctx,
          options.customServerValidators
        );
    }
  );

  try {
    // check if fromData is not empty
    // it can be if all the fields are optional
    // if so, just return empty data
    if (![...formData.entries()].length)
      return {
        error: null,
        data: {} as {
          [k in keyof z.objectUtil.addQuestionMarks<
            z.baseObjectOutputType<{
              [K in keyof Schema]: Schema[K]["validation"];
            }>,
            any
          >]: z.objectUtil.addQuestionMarks<
            z.baseObjectOutputType<{
              [K in keyof Schema]: Schema[K]["validation"];
            }>,
            any
          >[k];
        },
        cleanUp,
        createCustomError: async (errors) => {
          const errorsObj: FieldErrors<{
            [k in keyof z.objectUtil.addQuestionMarks<
              z.baseObjectOutputType<{
                [K in keyof Schema]: Schema[K]["validation"];
              }>,
              any
            >]: z.objectUtil.addQuestionMarks<
              z.baseObjectOutputType<{
                [K in keyof Schema]: Schema[K]["validation"];
              }>,
              any
            >[k];
          }> = {};
          for (const errKey in errors) {
            // @ts-expect-error We are sure that errKey can exist on errorObj as it has to be valid schema key
            errorsObj[errKey] = {
              message: errors[errKey],
            };
          }

          return json({
            errors: errorsObj,
            defaultValues: {},
          });
        },
      };

    // create resolver and try to validate data
    const resolver = zodResolver(validator);
    const { errors, data } = await validateFormData<FormData>(
      parsedData,
      resolver
    );

    // if errors -> return error response, but...
    // ...return them with default values so remix-hook-form on client-side can pick them up
    // run cleanup func as well
    if (errors) {
      await cleanUp(data as Record<string, any>);
      return {
        error: json({ errors, defaultValues: formData }),
        data: null,
        cleanUp: null,
        createCustomError: null,
      };
    }

    // if no errors, but no data
    // throw error, something is off...
    if (!data)
      throw new Error(
        "Remix-schema-form: Unexpected error... No errors received, but data is empty... It looks like not problem a problem in Remix-schema-form, but rather in Remix-hook-form as it should never be this way."
      );

    //
    // run custom transformation pipeline (if exist)
    // it can be used e.g. for images cropping and so forth
    // we wrap it in try ... catch block
    // thanks to that the function can easily throw errors
    // that we will automatically pick up
    try {
      //if no errors and data exists, return the data, but...
      // ...return cleanUp function as well
      // Why? Sometimes we wanna add some additional validation after the basic one
      // Then if error encountered, it should be thrown and with this... any files that have been stored should removed
      // That's what cleanup function is for.
      // We also provide the the createCustomError function if we want to return some custom error
      // it automatically runs cleanUp function as well
      return {
        error: null,
        data,
        cleanUp,
        createCustomError: async (errors) => {
          await cleanUp(data);

          const errorsObj: FieldErrors<{
            [k in keyof z.objectUtil.addQuestionMarks<
              z.baseObjectOutputType<{
                [K in keyof Schema]: Schema[K]["validation"];
              }>,
              any
            >]: z.objectUtil.addQuestionMarks<
              z.baseObjectOutputType<{
                [K in keyof Schema]: Schema[K]["validation"];
              }>,
              any
            >[k];
          }> = {};
          for (const errKey in errors) {
            // @ts-expect-error We are sure that errKey can exist on errorObj as it has to be valid schema key
            errorsObj[errKey] = {
              message: errors[errKey],
            };
          }

          return json({
            errors: errorsObj,
            defaultValues: formData,
          });
        },
      };
    } catch (e) {
      await cleanUp(data as Record<string, any>);
      return {
        error: json({
          errors: e as FieldErrors<{
            [k in keyof z.objectUtil.addQuestionMarks<
              z.baseObjectOutputType<{
                [K in keyof Schema]: Schema[K]["validation"];
              }>,
              any
            >]: z.objectUtil.addQuestionMarks<
              z.baseObjectOutputType<{
                [K in keyof Schema]: Schema[K]["validation"];
              }>,
              any
            >[k];
          }>,
          defaultValues: formData,
        }),
        cleanUp: null,
        data: null,
        createCustomError: null,
      };
    }
  } catch (error) {
    await cleanUp({});

    throw new Error(
      "Remix-schema-form: Unexpected error... Something went wrong during the process... " +
        (error instanceof Error ? error.message : "")
    );
  }
}
