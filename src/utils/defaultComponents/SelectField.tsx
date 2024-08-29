import {
  DefaultFormFieldComponentBaseProps,
  OptionsForBasicType,
} from "../types";
import styles from "./InputField.module.css";

export const SelectField = ({
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
  <div className={styles.field}>
    <label>
      <span className={styles.label}>{label}</span>
      <select
        className={styles.input}
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
      {description && <div className={styles.description}>{description}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </label>
  </div>
);
