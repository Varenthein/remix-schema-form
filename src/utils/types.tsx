import type z from "zod";
import type { Control, FieldErrors } from "react-hook-form";
import type { TypedResponse } from "@remix-run/node";
import type { BasicFieldsSchemas, BasicSupportedFieldType } from "../config";
import type React from "react";
import type { useRemixForm } from "remix-hook-form";

// Types for ensuring that field options we want to use have valid format
export type FormFieldOptionVal =
  | string
  | number
  | boolean
  | Date
  | { [X: string]: FormFieldOptionVal }
  | Array<Date>
  | Array<string>
  | Array<number>
  | Array<boolean>
  | Array<Record<string, FormFieldOptionVal>>;
export type FormFieldOptions = Record<string, FormFieldOptionVal>;

// Generic type for creating field type schema
export type FormFieldSchema<
  TypeName extends string,
  LangKey extends string,
  AdditionalSettings extends {
    options?: FormFieldOptions;
  } | void = void
> = AdditionalSettings extends {
  options?: FormFieldOptions;
}
  ? {
      label: LangKey;
      description?: LangKey;
      required?: boolean;
      disabled?: boolean;
      type: TypeName;
      validation: z.ZodTypeAny;
      conditioned?: (data: object) => Boolean;
    } & AdditionalSettings
  : {
      label: LangKey;
      description?: LangKey;
      required?: boolean;
      disabled?: boolean;
      type: TypeName;
      validation: z.ZodTypeAny;
      conditioned?: (data: object) => Boolean;
    };

// Universal type for any field schema (basic or custom)
export type AnyFormFieldsSchema = Record<
  string,
  FormFieldSchema<string, string> & { options?: any }
>;

// Type that supports all basic form fields schemas
// It can support also custom fields (if they present as type variable)
export type BaseFormFieldSchema<
  LangKey extends string,
  CustomFormFieldSchema = void
> =
  | BasicFieldsSchemas<LangKey>
  | (CustomFormFieldSchema extends FormFieldSchema<string, LangKey>
      ? CustomFormFieldSchema
      : never);

// Type for the whole form fields schema that supports basic field types
// It supports also custom fields (if they present as type variable)
export type BaseFormFieldsSchema<
  LangKey extends string,
  CustomFormFieldSchema = void
> = Record<string, BaseFormFieldSchema<LangKey, CustomFormFieldSchema>>;

// Type that allows only for options of specific field type
// It works for basic fields, but supports custom fields as well (if they are present as type)
export type OptionsForType<
  T extends string,
  CustomFormFieldSchema = void,
  LangKey extends string = string
> = Required<
  Extract<
    BaseFormFieldSchema<LangKey, CustomFormFieldSchema>,
    {
      type: T;
      options?: unknown;
    }
  >
>["options"];

export type OptionsForBasicType<
  T extends BasicSupportedFieldType,
  LangKey extends string = string
> = Required<
  Extract<
    BaseFormFieldSchema<LangKey>,
    {
      type: T;
      options?: unknown;
    }
  >
>["options"];

// Universal type for any form field component
export type FormFieldComponent<
  T extends string,
  CustomFormFieldSchema = void
> = (props: {
  label?: string;
  description?: string;
  options: OptionsForType<T, CustomFormFieldSchema>;
  error: string | null;
  fieldName: string;
  register: (args: any) => object;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  control: Control<
    {
      [x: string]: any;
    },
    any
  >;
}) => React.ReactNode | null;

// Type to be used when creating custom ValidatedForm component.
// Defaults to schema with only basic supported fields if no type variable provided.
// It cover minimum props that have to be in use, but we can add our own as well.
export type ValidatedFormBaseProps<
  Schema = BaseFormFieldsSchema<string, void>
> = {
  schema: Schema;
  submitActionName: string;
  action?: string;
  defaultValues?: any;
  schemaConditionals?: AnySchemaConditionals;
};

// Type that represents an object with proper required React components.
// It should cover each basic form field and message/submitBtn components.
// It doesn't cover custom components
export type ValidatedFormBaseComponents = {
  [X in BasicSupportedFieldType]: FormFieldComponent<X>;
} & {
  message: ({
    variant,
    items,
    children,
  }:
    | { variant: "success"; items?: undefined; children: React.ReactNode }
    | {
        variant: "error";
        items: string[];
        children?: React.ReactNode;
      }) => React.ReactNode;
  submitBtn: ({
    type,
    isSubmitting,
    children,
  }: {
    type: "button" | "submit" | "reset";
    isSubmitting?: boolean;
    children: React.ReactNode;
  }) => React.ReactNode;
};

// Type that represents an object with proper required React components.
// It should cover each basic form field, message/submitBtn components...
// ...but also custom fields (if type variable provided)
export type ValidatedFormComponents<
  ObjWithTypeKeys extends object | void = void,
  CustomFormFieldSchema = void
> = keyof ObjWithTypeKeys extends string
  ? ValidatedFormBaseComponents &
      Record<
        keyof ObjWithTypeKeys,
        FormFieldComponent<keyof ObjWithTypeKeys, CustomFormFieldSchema>
      >
  : ValidatedFormBaseComponents;

// Type that allows creating safe custom form fields schemas.
// It requires to every custom type be described.
// At least as {}, so field doesn't allow for any options beside basic ones (label, desc etc.)
// But we can also add options we want to require...
// ...and they will be checked for valid format.
// Disclaimer:
// It's only for custom fields, it is not for basic fields as they are described in this file separately
export type FormFieldsSchemas<
  CustomSupportedFieldType extends string,
  LangKey extends string,
  T extends {
    [X in CustomSupportedFieldType]: {
      options?: FormFieldOptions;
    };
  } & Record<Exclude<keyof T, CustomSupportedFieldType>, never>
> = T extends {
  [x in CustomSupportedFieldType]: {
    options?: FormFieldOptions;
  };
}
  ? {
      [X in keyof T]: X extends string
        ? FormFieldSchema<X, LangKey, T[X]>
        : never;
    }[keyof T]
  : never;

// Type that converts form fields schema to desired zod validation object
export type SchemaToZodObj<
  Schema extends Record<
    string,
    { validation: z.ZodTypeAny; conditioned?: (data: object) => Boolean }
  >
> = z.ZodObject<{
  [K in keyof Schema]: Schema[K]["conditioned"] extends object
    ? Schema[K]["validation"] | z.ZodUndefined
    : Schema[K]["validation"];
}>;

// Type for custom getFormData function
export type GetFormDataFunc = <
  Schema extends AnyFormFieldsSchema,
  Conditionals extends AnySchemaConditionals | undefined
>(
  request: Request,
  schema: Schema,
  schemaConditionals?: Conditionals
) => Promise<
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
>;

// Type for custom cleanup function
export type CleanUpFunc = (data: Record<string, any>) => Promise<void>;

// Type for custom remove file function
export type FileRemoveFunc = (name: string) => Promise<void>;

// Types for options translation conf object (separately for basic and custom fields)
export type RecursiveOption<Option> = Option extends object
  ? Option extends Array<infer T>
    ? T extends object
      ? RecursiveOption<T>
      : T extends string
      ? true
      : never
    : Option extends Date
    ? never
    : Option extends Function
    ? never
    : { [L in keyof Option]?: RecursiveOption<Option[L]> }
  : Option extends string
  ? true
  : never;

export type OptionsTranslationConfigBase = {
  [X in Required<
    Extract<BaseFormFieldSchema<string>, { options?: unknown }>
  > as X["type"]]?: {
    [Y in keyof X["options"]]?: RecursiveOption<X["options"][Y]>;
  };
};

export type OptionsTranslationConfigCustom<
  CustomType extends string,
  CustomFormFieldSchema extends FormFieldSchema<CustomType, string> & {
    options?: unknown;
  }
> = {
  [X in Required<
    Extract<CustomFormFieldSchema, { options?: unknown }>
  > as X["type"]]?: RecursiveOption<X["options"]>;
};

// Type for any field translations config
export type AnyFieldOptionsTranslationsConfig = {
  [X: string]: any;
};

// Type for translate func
export type TranslateFunc = (
  key: string,
  values?: Record<string, any>
) => string;

// Types for creating fields additional validation objects (basic or custom)
export type FieldAdditionalValidators<
  SupportedFieldType extends string,
  LangKey extends string = string,
  CustomFormFieldSchema extends FormFieldSchema<string, string> | void = void
> = {
  [X in SupportedFieldType]?: (props: {
    schema: AnyFormFieldsSchema;
    data: Record<string, any>;
    fieldName: string;
    value: any;
    options: OptionsForType<X, CustomFormFieldSchema>;
  }) => {
    path: (keyof AnyFormFieldsSchema)[];
    message: LangKey;
  } | null;
};

export type AnyFieldAdditionalValidators = {
  [X in string]?: (props: {
    schema: AnyFormFieldsSchema;
    data: Record<string, any>;
    fieldName: string;
    value: any;
    options: any;
  }) => {
    path: (keyof AnyFormFieldsSchema)[];
    message: string;
  } | null;
};

// Types for creating fields server validation objects
export type FieldServerValidators<
  SupportedFieldType extends string,
  LangKey extends string = string,
  CustomFormFieldSchema extends FormFieldSchema<string, string> | void = void
> = {
  [X in SupportedFieldType]?: (props: {
    request: Request;
    schema: AnyFormFieldsSchema;
    data: Record<string, any>;
    fieldName: string;
    value: any;
    options: OptionsForType<X, CustomFormFieldSchema>;
  }) => {
    path: (keyof AnyFormFieldsSchema)[];
    message: LangKey;
  } | null;
};

export type AnyFieldServerValidators = {
  [X in string]?: (props: {
    request: Request;
    schema: AnyFormFieldsSchema;
    data: Record<string, any>;
    fieldName: string;
    value: any;
    options: any;
  }) => {
    path: (keyof AnyFormFieldsSchema)[];
    message: string;
  } | null;
};

// Types for optional children func that we can use in ValidatedForm component
// it can be used to directly decide about fields placement
export type ValidatedFormFieldsComponentsObj<
  Schema extends AnyFormFieldsSchema
> = {
  [X in keyof Schema]: (props: { className?: string }) => React.ReactNode;
};
export type ValidatedFormCompChildren<Schema extends AnyFormFieldsSchema> = (
  items: ValidatedFormFieldsComponentsObj<Schema>
) => React.ReactNode;

export type AnyValidatedFormCompChildren = (data: {
  Form: any;
  control: ReturnType<typeof useRemixForm>["control"];
  errors: ReturnType<typeof useRemixForm>["formState"]["errors"];
  register: ReturnType<typeof useRemixForm>["register"];
}) => React.ReactNode;

export type FormFieldsChildrenFunc<Schema extends AnyFormFieldsSchema> =
  (data: {
    Form: {
      [X in keyof Schema as X extends string ? Capitalize<X> : X]: (props: {
        className?: string;
        control: ReturnType<typeof useRemixForm>["control"];
        errors: ReturnType<typeof useRemixForm>["formState"]["errors"];
        register: ReturnType<typeof useRemixForm>["register"];
      }) => React.ReactNode;
    };
    control: ReturnType<typeof useRemixForm>["control"];
    errors: ReturnType<typeof useRemixForm>["formState"]["errors"];
    register: ReturnType<typeof useRemixForm>["register"];
  }) => React.ReactNode;

// Types for defining conditional fields behavior
export type SchemaConditionals<Schema extends AnyFormFieldsSchema> = Partial<
  {
    [K in keyof Schema]: (data: {
      [X in keyof Schema]: z.infer<Schema[X]["validation"]> | undefined;
    }) => Boolean;
  } & { __watch: (keyof Schema)[] }
>;

export type AnySchemaConditionals = Record<
  string,
  ((data: any) => Boolean) | string[]
> & { __watch?: string[] };

export type SchemaWithOptionalConditionals<Schema extends AnyFormFieldsSchema> =
  {
    [X in keyof Schema]: Schema[X] & {
      conditioned?: (data: object) => Boolean;
    };
  };
