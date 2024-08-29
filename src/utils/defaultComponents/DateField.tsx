import {
  DefaultFormFieldComponentBaseProps,
  OptionsForBasicType,
} from "../types";

export const DateField = ({
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
}: DefaultFormFieldComponentBaseProps & {
  options: OptionsForBasicType<"date">;
}) => {
  const safeOptions = typeof options === "object" ? options : null;

  return (
    <div className={className}>
      <label>
        {label}
        <input
          type="date"
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
          min={
            safeOptions &&
            "minDate" in safeOptions &&
            typeof safeOptions.minDate === "object"
              ? safeOptions.minDate.toLocaleDateString()
              : undefined
          }
          max={
            safeOptions &&
            "maxDate" in safeOptions &&
            typeof safeOptions.maxDate === "object"
              ? safeOptions.maxDate.toLocaleDateString()
              : undefined
          }
          {...props}
          {...register(fieldName)}
        />
        {description && <span>{description}</span>}
        {error && <span style={{ color: "red" }}>{error}</span>}
      </label>
    </div>
  );
};
