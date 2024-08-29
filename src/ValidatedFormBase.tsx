import type {
  ValidatedFormBaseComponents,
  AnyFormFieldsSchema,
  FormFieldComponent,
  TranslateFunc,
  AnyFieldOptionsTranslationsConfig,
  AnyFieldAdditionalValidators,
  ValidatedFormFieldsComponentsObj,
  AnyValidatedFormCompChildren,
  FormFieldSchema,
  AnySchemaConditionals,
} from "./utils/types";
import { createValidatorFromSchema } from "./utils/createValidatorFromSchema";
import { Form, useActionData } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { prepareValidationError } from "./utils/prepareValidationError";
import {
  additionalZodValidatorsForBasicFields,
  basicFieldsTranslationsConfig,
} from "./config";
import { translateFormFieldsOptions } from "./utils/translateFormFieldOptions";
import { FormEvent, useEffect, useMemo } from "react";
import { runAdditionalZodValidations } from "./utils/runAdditionalZodValidations";
import { schemaHasConditionalFields } from "./utils/schemaHasConditionalFields";
import { enhanceSchemaWithConditionals } from "./utils/enhanceSchemaWithConditionals";
import { capitalize } from "./utils/capitalize";
import { defaultTranslateFunc } from "./utils/defaultTranslateFunc";
import { defaultComponents } from "./utils/defaultComponents";

export const ValidatedFormBase = ({
  schema: plainSchema,
  schemaConditionals,
  components = defaultComponents,
  action,
  successMessage,
  defaultValues,
  submitActionName,
  translateFunc = defaultTranslateFunc,
  scrollTopAfterSuccess,
  customFieldsTranslationConfig,
  customAdditionalValidators,
  mode = "onSubmit",
  children,
  onSuccess,
}: {
  schema: AnyFormFieldsSchema;
  schemaConditionals?: AnySchemaConditionals;
  components?: ValidatedFormBaseComponents;
  submitActionName: string;
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  translateFunc?: TranslateFunc;
  successMessage?: string;
  scrollTopAfterSuccess?: boolean;
  action?: string;
  defaultValues?: any;
  customFieldsTranslationConfig?: AnyFieldOptionsTranslationsConfig;
  customAdditionalValidators?: AnyFieldAdditionalValidators;
  children?: AnyValidatedFormCompChildren;
  onSuccess?: (data: Record<string, any>) => void;
}) => {
  // get potential success info
  const actionData = useActionData<unknown>();

  // prepare shortcuts for both submit and message components
  const SubmitButton = components.submitBtn;
  const Message = components.message;

  // if schema conditionals provided, add them to proper schema fields
  // if not -> just use schema as it is
  const schema = schemaConditionals
    ? enhanceSchemaWithConditionals(plainSchema, schemaConditionals)
    : plainSchema;

  // create zod validator from schema and create remix form object based on that
  // refine it with additional (multi-field) validation for basic fields and custom ones
  const createValidator = (values: Record<string, any> = {}) => {
    return createValidatorFromSchema(schema, values).superRefine(
      (fields, ctx) => {
        runAdditionalZodValidations(
          schema,
          fields,
          ctx,
          additionalZodValidatorsForBasicFields
        );
        customAdditionalValidators &&
          runAdditionalZodValidations(
            schema,
            fields,
            ctx,
            customAdditionalValidators
          );
      }
    );
  };
  const validator = createValidator(defaultValues);

  // initialize Remix hook form with received schema
  // get form state, methods and controls from Remix hook form
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    register,
    watch,
  } = useRemixForm<z.infer<typeof validator>>({
    mode,
    resolver: (...args) => {
      return zodResolver(createValidator(args[0]))(...args);
    },
    defaultValues,
  });

  // if there conditional fields, make sure to watch the changes in real-time
  // they are needed to properly show/hide conditioned fields
  // if __watch option is provided in schemaConditionals
  // use it to update state more in a more performant way
  // as it should points out which fields are important for conditionals
  const data = schemaHasConditionalFields(schema)
    ? schemaConditionals?.__watch
      ? watch(schemaConditionals?.__watch).reduce((sum, val, i) => {
          return {
            ...sum,
            [schemaConditionals?.__watch![i]!]: val,
          };
        }, {} as any)
      : watch()
    : null;

  // Func for getting form field component based on given type
  const getComponentForFieldType = (
    type: string
  ): FormFieldComponent<string> => {
    if (type in components)
      return components[
        type as keyof typeof components
      ] as FormFieldComponent<string>;
    throw new Error(`Unsupported field type: ${type}`);
  };

  // Func that creates and returns specific form field component instance for given field
  const getComponentInstanceForField = (
    fieldName: string,
    fieldSchema: FormFieldSchema<string, string> & { options?: any },
    additionalProps?: {
      className?: string;
      control: ReturnType<typeof useRemixForm>["control"];
      errors: ReturnType<typeof useRemixForm>["formState"]["errors"];
      register: ReturnType<typeof useRemixForm>["register"];
    }
  ) => {
    const Component = getComponentForFieldType(fieldSchema.type);
    if (!Component) return null;

    const currentErrors = additionalProps?.errors ?? errors;
    const error = currentErrors[fieldName]
      ? prepareValidationError(currentErrors[fieldName])
      : null;

    return (
      <Component
        key={fieldName}
        control={additionalProps?.control ?? control}
        label={translateFunc(fieldSchema.label)}
        description={
          fieldSchema.description ? translateFunc(fieldSchema.description) : ""
        }
        error={error ? translateFunc(error.message, error.values) : null}
        fieldName={fieldName}
        register={additionalProps?.register ?? register}
        required={fieldSchema.required}
        disabled={fieldSchema.disabled}
        className={additionalProps?.className ?? ""}
        options={
          fieldSchema.options
            ? translateFormFieldsOptions(
                translateFunc,
                fieldSchema.options as Record<string, any>,
                {
                  ...basicFieldsTranslationsConfig,
                  ...customFieldsTranslationConfig,
                }[fieldSchema.type]
              )
            : (null as any)
        }
      />
    );
  };

  // Func that creates component instances for all form fields
  // it returns them as array that can be directly rendered
  // e.g. [<A />, <B />]
  const getAllFieldsComponents = () => {
    if (schemaHasConditionalFields(schema) && data)
      return Object.entries(schema)
        .filter(
          ([_, fieldSchema]) =>
            !fieldSchema.conditioned ||
            (fieldSchema.conditioned && fieldSchema.conditioned(data))
        )
        .map(([fieldName, fieldSchema]) =>
          getComponentInstanceForField(fieldName, fieldSchema)
        );
    else
      return Object.entries(schema).map(([fieldName, fieldSchema]) =>
        getComponentInstanceForField(fieldName, fieldSchema)
      );
  };

  // Func that creates higher-order version of formFields components
  // it is needed for children as func feature where we can decide directly about fields placement inside the form
  // these higher-order components require current form info (control, errors, register) and allow for optional className prop
  // internally they just run original component, but with this additional data
  const fieldsComponentsForExternalUse = useMemo(() => {
    const hocFormFieldsComponents: Record<
      keyof typeof schema,
      (options: {
        className?: string;
        control: ReturnType<typeof useRemixForm>["control"];
        errors: ReturnType<typeof useRemixForm>["formState"]["errors"];
        register: ReturnType<typeof useRemixForm>["register"];
      }) => React.ReactNode
    > = {};

    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      hocFormFieldsComponents[fieldName] = ({
        className,
        control,
        errors,
        register,
      }) =>
        getComponentInstanceForField(fieldName, fieldSchema, {
          className,
          control,
          errors,
          register,
        });
    }

    return hocFormFieldsComponents;
  }, [components]);

  // Func that creates obj with form fields HOC instances for every field
  // it returns them as key described object
  // where every key is fieldName and the value is a simple func that can render specific form field component instance for us
  // we use it when children prop is provided where we simply provide component instances and let user choose where to place them
  // Disclaimer: it takes into account conditionals, so if field is supposed to be hidden, we receive comp instance that simply returns null
  const getAllFieldsComponentsAsObj =
    (): ValidatedFormFieldsComponentsObj<AnyFormFieldsSchema> => {
      return Object.entries(schema).reduce(
        (sum, [fieldName, fieldSchema]) => ({
          ...sum,
          [capitalize(fieldName as string)]:
            !fieldSchema.conditioned || fieldSchema.conditioned(data!)
              ? fieldsComponentsForExternalUse[fieldName]
              : (_?: any) => null,
        }),
        {} as any
      );
    };

  // Effect that scrolls to top after success successful form submission
  // but only if this setting is on
  useEffect(() => {
    if (isSubmitSuccessful && scrollTopAfterSuccess) {
      window.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSubmitSuccessful]);

  // before submit: determine valid encType
  // if there is at least one file, use "multipart/form-data"
  // otherwise use "x-www-form-urlencoded"
  const beforeSubmit = (e: FormEvent<HTMLFormElement>) => {
    const formElem = e.target as HTMLFormElement;
    const fields = control._formValues;
    if (
      Object.values(fields).find((val) => val instanceof FileList && val.length)
    )
      formElem.setAttribute("encType", "multipart/form-data");
    else formElem.setAttribute("encType", "x-www-form-urlencoded");

    handleSubmit(e);
  };

  // try to read global error
  const globalError = errors?.root?.message as string | string[] | undefined;

  // if success and onSuccess exist -> run it with current data
  useEffect(() => {
    console.log(control);
    if ((actionData as { success: true })?.success && onSuccess)
      onSuccess(control._formValues);
  }, [actionData]);

  return (
    <Form
      onSubmit={beforeSubmit}
      className="space-y-8"
      action={action}
      method="post"
    >
      {!isSubmitting &&
        (actionData as { success: true })?.success &&
        successMessage && (
          <Message variant="success">{translateFunc(successMessage)}</Message>
        )}
      {globalError && (
        <Message
          variant="error"
          items={
            typeof globalError === "object" && Array.isArray(globalError)
              ? globalError.map((i) => translateFunc(i))
              : [translateFunc(globalError)]
          }
        />
      )}
      {children &&
        children({
          Form: getAllFieldsComponentsAsObj(),
          control,
          errors,
          register,
        })}
      {!children && getAllFieldsComponents()}
      <SubmitButton type="submit" isSubmitting={isSubmitting}>
        {translateFunc(submitActionName)}
      </SubmitButton>
    </Form>
  );
};
