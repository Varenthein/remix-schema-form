import { AnyFieldOptionsTranslationsConfig, TranslateFunc } from "./types";

export const translateFormFieldsOptions = (
  translateFunc: TranslateFunc,
  options: Record<string, any>,
  optionsTranslationsConfig?: AnyFieldOptionsTranslationsConfig
) => {
  if (!optionsTranslationsConfig) return options;

  const prepareOptions = (
    data: Record<string, any>,
    optionsConfig: AnyFieldOptionsTranslationsConfig
  ) => {
    const translatedData: Record<keyof typeof data, any> = {};

    for (const key in data) {
      if (typeof data[key] === "object" && !(key in optionsConfig)) {
        translatedData[key] = data[key];
        continue;
      }

      if (typeof data[key] === "object") {
        if (Array.isArray(data[key]) && optionsConfig[key] === true)
          translatedData[key] = data[key].map((i) => translateFunc(i));
        else if (Array.isArray(data[key]) && optionsConfig[key] !== true)
          translatedData[key] = data[key].map((i) =>
            prepareOptions(i, optionsConfig[key])
          );
        else
          translatedData[key] = prepareOptions(data[key], optionsConfig[key]);
        continue;
      }

      if (optionsConfig[key] === true)
        translatedData[key] = translateFunc(data[key]);
      else translatedData[key] = data[key];
    }

    return translatedData;
  };

  return prepareOptions(options, optionsTranslationsConfig);
};
