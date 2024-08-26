import { FileRemoveFunc } from "./types";

export const cleanUpFileFields = async (
  formData: FormData,
  removeFile: FileRemoveFunc
) => {
  const data: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  const filesToDelete: string[] = [];
  const isFile = (value: any) =>
    value && typeof value === "object" && "filepath" in value;

  Object.values(data).forEach((value) => {
    if (isFile(value)) {
      filesToDelete.push(value.name);
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (isFile(item)) {
          filesToDelete.push(item.name);
        }
      });
    }
  });

  await Promise.all(filesToDelete.map((name) => removeFile(name)));
};
