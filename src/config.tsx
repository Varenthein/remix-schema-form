import { DateField } from "./utils/defaultComponents/DateField";
import { InputField } from "./utils/defaultComponents/InputField";
import { SelectField } from "./utils/defaultComponents/SelectField";
import { SwitchField } from "./utils/defaultComponents/SwitchField";
import { TextareaField } from "./utils/defaultComponents/TextareaField";
import {
  FieldAdditionalValidators,
  FormFieldsSchemas,
  OptionsTranslationConfigBase,
  ValidatedFormBaseComponents,
} from "./utils/types";

// Basic supported field types
export type BasicSupportedFieldType =
  | "text"
  | "password"
  | "textarea"
  | "select"
  | "switch"
  | "checkbox"
  | "number"
  | "file"
  | "files"
  | "date";

// Detailed form field schemas for specific types
export type BasicFieldsSchemas<LangKey extends string> = FormFieldsSchemas<
  BasicSupportedFieldType,
  LangKey,
  {
    text: {
      options?: {
        role?: "text" | "email" | "search" | "tel" | "url";
        placeholder?: LangKey;
      };
    };
    password: {
      options?: {
        role: "passwordRepeat";
      };
    };
    textarea: {
      options?: {
        placeholder?: LangKey;
      };
    };
    select: {
      options: {
        placeholder?: LangKey;
        data: {
          name: LangKey;
          value: string;
        }[];
      };
    };
    switch: {};
    checkbox: {};
    number: {};
    file: {};
    files: {};
    date: {
      options?: {
        minDate?: Date;
        maxDate?: Date;
        picker?: boolean;
      };
    };
  }
>;

// Options translation

// At default only label and errors are considered to be lang keys...
// ...and only they are translated in ValidateFormBase before being provided to specific FormField component.
// However some of fields allow us to define additional options (like data for selects).
// In this scenario we ofter define options that also should be translated.
// Here we can define which options for which field types should be considered.
export const basicFieldsTranslationsConfig: OptionsTranslationConfigBase = {
  text: {
    placeholder: true,
  },
  textarea: {
    placeholder: true,
  },
  select: {
    placeholder: true,
    data: {
      name: true,
    },
  },
};

// Additional zod validators that run in superRefine after standard single field validation
export const additionalZodValidatorsForBasicFields: FieldAdditionalValidators<BasicSupportedFieldType> =
  {
    password: ({ schema, data, fieldName, options }) => {
      const value = data[fieldName];

      // check if it's first password input
      // if it's not repeat password field, we don't need to check anything yet
      if (!options?.role) return null;

      // if it has role, it has to have passwordRepeat role (there aren't any other supported roles for password atm)
      // so... find original password field and check if they are all right.
      for (const [k, f] of Object.entries(schema)) {
        if (f?.type === "password" && f?.options?.role !== "passwordRepeat") {
          if (value !== data[k])
            return {
              message: "passwordsDontMatch",
              path: [fieldName, k],
            };
          else return null;
        }
      }

      return null;
    },

    date: ({ data, fieldName, options }) => {
      const value = data[fieldName] as string | undefined;
      if (typeof value === "undefined") return null;

      if (options?.minDate && new Date(value) < options.minDate) {
        const minDate = options.minDate.toLocaleDateString();
        return {
          message: `dateTooEarly|min=${minDate}`,
          path: [fieldName],
        };
      }

      if (options?.maxDate && new Date(value) > options.maxDate) {
        const maxDate = options.maxDate.toLocaleDateString();
        return {
          message: `dateTooLate|max=${maxDate}`,
          path: [fieldName],
        };
      }

      return null;
    },
  };

// Default components to be used when no custom ones are provided
export const defaultComponents: ValidatedFormBaseComponents = {
  text: (args) => <InputField type={args.options?.role || "text"} {...args} />,
  password: (args) => <InputField type="password" {...args} />,
  switch: SwitchField,
  checkbox: (args) => <InputField type="checkbox" {...args} />,
  select: SelectField,
  textarea: TextareaField,
  number: (args) => <InputField type="number" {...args} />,
  file: (args) => <InputField {...args} type="file" />,
  files: (args) => <InputField {...args} type="file" multiple />,
  date: DateField,

  submitBtn: (args) => (
    <button type={args.type}>
      { args.isSubmitting ? "Submitting..." : args.children}
    </button>
  ),
  message: ({ variant, items, children }) => {
    if (variant === "success")
      return (
        <div style={{ margin: "10px auto", maxWidth: "200px", padding: "10px", border: "2px solid green"}}>
          <h2>Success!</h2>
          {children}
        </div>
      )
    else
      return (
        <div style={{ margin: "10px auto", maxWidth: "200px", padding: "10px", border: "2px solid red"}}>
          <h2>Error!</h2>
          {items.join(", ")}
        </div>
      )
  }
};

