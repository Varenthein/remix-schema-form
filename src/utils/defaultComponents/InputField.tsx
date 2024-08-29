import { DefaultFormFieldComponentBaseProps } from "../types";

export const InputField = ({
  className,
  label,
  description,
  options,
  error,
  fieldName,
  register,
  required,
  disabled,
  type,
  ...props
}: DefaultFormFieldComponentBaseProps & {
  type: "checkbox" | "number" | "search" | "text" | "email" | "tel" | "url" | "password" | "file";
} & Record<string, any>) => {
  const safeOptions = typeof options === "object" ? options : null;

  return (
    <div className={className}>
      <label>
        {label}
        <input
          placeholder={
            safeOptions &&
            "placeholder" in safeOptions &&
            typeof safeOptions.placeholder === "string"
              ? safeOptions.placeholder
              : ""
          }
          style={error ? { border: "1px solid red" } : {}}
          disabled={disabled}
          required={required}
          {...props}
          {...register(fieldName)}
        />
        {description && <div>{description}</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </label>
    </div>
  );
};
