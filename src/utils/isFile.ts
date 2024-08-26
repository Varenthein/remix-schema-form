export const isFile = (val: unknown) =>
  val &&
  typeof val === "object" &&
  "prototype" in val &&
  (val.prototype instanceof File || val.prototype instanceof Blob);
