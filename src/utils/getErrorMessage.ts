export const getErrorMessage = (e: unknown) => {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  else "unknown error";
};
