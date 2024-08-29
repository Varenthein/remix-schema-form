import styles from "./Button.module.css";

export const Button = ({
  type,
  children,
}: {
  type: "submit" | "button" | "reset";
  children: React.ReactNode;
}) => {
  return (
    <button type={type} className={styles.button}>
      {children}
    </button>
  );
};
