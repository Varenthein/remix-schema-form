import { DefaultFormFieldComponentBaseProps } from "../types";
import styles from "./SwitchField.module.css";

export const SwitchField = ({
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
  return (
    <div className={className}>
      <label>
        {label}
        <div className={styles.switch}>
          <input
            type="checkbox"
            style={error ? { border: "1px solid red" } : {}}
            disabled={disabled}
            required={required}
            {...props}
            {...register(fieldName)}
          />
        </div>
        {description && <span>{description}</span>}
        {error && <span style={{ color: "red" }}>{error}</span>}
      </label>
    </div>
  );
};
