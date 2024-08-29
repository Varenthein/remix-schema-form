import { DefaultFormFieldComponentBaseProps } from "../types";
import styles from "./SwitchField.module.css";

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
}: DefaultFormFieldComponentBaseProps) => {
  const safeOptions = typeof options === "object" ? options : null;

  return (
    <div className={styles.field}>
      <label>
        <span className={styles.label}>{label}</span>
        <textarea
          className={styles.input}
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
          {...register(fieldName)}
        />
        {description && <div className={styles.description}>{description}</div>}
        {error && <div className={styles.error}>{error}</div>}
      </label>
    </div>
  );
};
