export const createDummyFileList = (
  files: { name: string; type: string; size?: number }[]
) => {
  const dt = new DataTransfer();
  for (const { name, type, size } of files) {
    const file = new File([], name, { type });
    if (size)
      Object.defineProperty(file, "size", { value: size, configurable: true });
    dt.items.add(file);
  }

  return dt.files;
};
