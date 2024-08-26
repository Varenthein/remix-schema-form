const tryParseJSON = (jsonString: string) => {
  try {
    const json = JSON.parse(jsonString);

    return json;
  } catch (e) {
    return jsonString;
  }
};

export const generateFormDataWithFiles = (
  formData: FormData | URLSearchParams,
  preserveStringified = false
) => {
  // Initialize an empty output object.
  const outputObject: Record<any, any> = {};

  // Iterate through each key-value pair in the form data.
  for (const [key, value] of formData.entries()) {
    // Try to convert data to the original type, otherwise return the original value
    // Disclaimer: Leave files alone as they couldn't be stringified anyway
    const getData = () => {
      if (
        value instanceof Blob ||
        (value as any) instanceof File ||
        toString.call(value) === "[object Blob]" ||
        toString.call(value) === "[object File]"
      ) {
        const allValues = formData.getAll(key);
        return allValues.length === 1 ? [allValues[0]] : allValues;
      } else
        return preserveStringified ? value : tryParseJSON(value.toString());
    };
    const data = getData();

    // Split the key into an array of parts.
    const keyParts = key.split(".");
    // Initialize a variable to point to the current object in the output object.
    let currentObject = outputObject;

    // Iterate through each key part except for the last one.
    for (let i = 0; i < keyParts.length - 1; i++) {
      // Get the current key part.
      const keyPart = keyParts[i];
      // If the current object doesn't have a property with the current key part,
      // initialize it as an object or array depending on whether the next key part is a valid integer index or not.
      if (!currentObject[keyPart as string]) {
        currentObject[keyPart as string] = /^\d+$/.test((keyParts as string[])[i + 1] as string) ? [] : {};
      }
      // Move the current object pointer to the next level of the output object.
      currentObject = currentObject[keyPart as string];
    }

    // Get the last key part.
    const lastKeyPart = keyParts[keyParts.length - 1];
    const lastKeyPartIsArray = /\[\d*\]$|\[\]$/.test(lastKeyPart as string);

    // Handles array[] or array[0] cases
    if (lastKeyPartIsArray) {
      const key = (lastKeyPart as string).replace(/\[\d*\]$|\[\]$/, "");
      if (!currentObject[key]) {
        currentObject[key] = [];
      }

      currentObject[key].push(data);
    }

    // Handles array.foo.0 cases
    if (!lastKeyPartIsArray) {
      // If the last key part is a valid integer index, push the value to the current array.
      if (/^\d+$/.test(lastKeyPart as string)) {
        currentObject.push(data);
      }
      // Otherwise, set a property on the current object with the last key part and the corresponding value.
      else {
        currentObject[lastKeyPart as string] = data;
      }
    }
  }

  // Return the output object.
  return outputObject;
};
