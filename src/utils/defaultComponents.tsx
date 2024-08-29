import { DateField } from "./defaultComponents/DateField";
import { InputField } from "./defaultComponents/InputField";
import { SelectField } from "./defaultComponents/SelectField";
import { SwitchField } from "./defaultComponents/SwitchField";
import { TextareaField } from "./defaultComponents/TextareaField";
import { ValidatedFormBaseComponents } from "./types";

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

