import { DefaultFormFieldComponentBaseProps } from "../types";
import styles from "./SwitchField.module.css";
import fieldStyles from "./InputField.module.css";

export const SwitchField = ({
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
    <div className={fieldStyles.field}>
      <label>
        <span className={fieldStyles.label}>{label}</span>
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
        {description && <div className={fieldStyles.description}>{description}</div>}
        {error && <div className={fieldStyles.error}>{error}</div>}
      </label>
    </div>
  );
};
