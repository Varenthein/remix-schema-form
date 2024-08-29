import {
  DefaultFormFieldComponentBaseProps,
  OptionsForBasicType,
} from "../types";
import styles from "./InputField.module.css";

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
}: DefaultFormFieldComponentBaseProps & {
  options: OptionsForBasicType<"date">;
}) => {
  const safeOptions = typeof options === "object" ? options : null;

  return (
    <div className={styles.field}>
      <label>
        <span className={styles.label}>{label}</span>
        <input
          className={styles.input}
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
          {...register(fieldName)}
        />
        {description && <div className={styles.description}>{description}</div>}
        {error && <div className={styles.error}>{error}</div>}
      </label>
    </div>
  );
};
