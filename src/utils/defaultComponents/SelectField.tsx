import {
  DefaultFormFieldComponentBaseProps,
  OptionsForBasicType,
} from "../types";

export const SelectField = ({
  className,
  label,
  description,
  options,
  error,
  fieldName,
  register,
  required,
  disabled,
}: Omit<DefaultFormFieldComponentBaseProps, "Component"> & {
  options: OptionsForBasicType<"select">;
}) => (
  <div className={className}>
    <label>
      {label}
      <select
        disabled={disabled}
        style={error ? { border: "1px solid red" } : {}}
        required={required}
        {...register(fieldName)}
      >
        {options.data.map((i) => (
          <option key={i.value} value={i.value}>
            {i.name}
          </option>
        ))}
      </select>
      {description && <span>{description}</span>}
      {error && <span style={{ color: "red" }}>{error}</span>}
    </label>
  </div>
);
