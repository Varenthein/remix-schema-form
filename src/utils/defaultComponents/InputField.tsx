import { DefaultFormFieldComponentBaseProps } from "../types";
import styles from "./InputField.module.css";

export const InputField = ({
  label,
  description,
  options,
  error,
  fieldName,
  register,
  required,
  disabled,
  type,
}: DefaultFormFieldComponentBaseProps & {
  type:
    | "checkbox"
    | "number"
    | "search"
    | "text"
    | "email"
    | "tel"
    | "url"
    | "password"
    | "file";
} & Record<string, any>) => {
  const safeOptions = typeof options === "object" ? options : null;

  return (
    <div className={styles.field}>
      <label>
        <span className={styles.label}>{label}</span>
        <input
          type={type}
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
