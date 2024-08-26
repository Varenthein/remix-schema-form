import { defaultErrors } from "./defaultErrors";

export const defaultTranslateFunc = (
  key: string,
  values?: Record<string, string>
) => {
  if (!(key in defaultErrors)) return "";
  else {
    let text = defaultErrors[key as keyof typeof defaultErrors];
    if (values)
      for (const key in values) {
        text = text.replaceAll(`{{${key}}}`, values[key] as string);
      }

    return text;
  }
};
