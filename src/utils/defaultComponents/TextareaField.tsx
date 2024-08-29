import { DefaultFormFieldComponentBaseProps } from "../types";

export const TextareaField = ({
  className,
  label,
  description,
  options,
  error,
  fieldName,
  register,
  required,
  disabled,
  ...props
}: DefaultFormFieldComponentBaseProps) => {
  const safeOptions = typeof options === "object" ? options : null;

  return (
    <div className={className}>
      <label>
        {label}
        <textarea
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
        {description && <span>{description}</span>}
        {error && <span style={{ color: "red" }}>{error}</span>}
      </label>
    </div>
  );
};
