import * as z from "zod";
import { tryToGetZodErrorMsg } from "../utils/tryToGetZodErrorMsg";
import { zFile } from "../../src/utils/zodSchemaHelpers/zFile";
import { createDummyFileList } from "../utils/createDummyFileList";

const exampleFileList = createDummyFileList([
  { name: "test.html", type: "text.html" },
]);

test("should properly parse valid input data (no options)", () => {
  const mySchema = z.object({
    test: zFile(),
  });

  expect(mySchema.parse({ test: undefined })).toEqual({ test: undefined });
  expect(mySchema.parse({ test: exampleFileList })).toEqual({
    test: exampleFileList[0],
  });
});

test("should require input data if required option is set to true", () => {
  const mySchema = z.object({
    test: zFile({
      required: true,
    }),
  });

  expect(mySchema.parse({ test: exampleFileList })).toEqual({
    test: exampleFileList[0],
  });
  expect(() => mySchema.parse({ test: undefined })).toThrowError(z.ZodError);
  expect(() => mySchema.parse({ test: [] })).toThrowError(z.ZodError);
});

test("should throw error if input data is invalid", () => {
  const mySchema = z.object({
    test: zFile(),
  });

  const items = [null, {}, 0, "test", true, false];
  for (const item of items)
    expect(() => mySchema.parse({ test: item })).toThrowError(z.ZodError);
});

test("should throw error if input file has invalid extension (accept option is set)", () => {
  const mySchema = z.object({
    test: zFile({
      accept: ["image/png", "image/gif"],
    }),
  });

  const examplePngFileList = createDummyFileList([
    { name: "test.png", type: "image/png" },
  ]);
  const exampleGifFileList = createDummyFileList([
    { name: "test.gif", type: "image/gif" },
  ]);
  const exampleHtmlFileList = createDummyFileList([
    { name: "test.html", type: "text/html" },
  ]);

  expect(mySchema.parse({ test: examplePngFileList })).toEqual({
    test: examplePngFileList[0],
  });
  expect(mySchema.parse({ test: exampleGifFileList })).toEqual({
    test: exampleGifFileList[0],
  });
  expect(() => mySchema.parse({ test: exampleHtmlFileList })).toThrowError(
    z.ZodError
  );
});

test("should throw error if max size is exceeded (maxSize option is set)", () => {
  const mySchema = z.object({
    test: zFile({
      maxSize: 1024 * 1024 * 5,
    }),
  });

  const examplePngFileList = createDummyFileList([
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 4 },
  ]);
  const exampleGifFileList = createDummyFileList([
    { name: "test.gif", type: "image/gif", size: 1024 * 1024 * 5 },
  ]);
  const exampleHtmlFileList = createDummyFileList([
    { name: "test.html", type: "text/html", size: 1024 * 1024 * 6 },
  ]);

  expect(mySchema.parse({ test: examplePngFileList })).toEqual({
    test: examplePngFileList[0],
  });
  expect(mySchema.parse({ test: exampleGifFileList })).toEqual({
    test: exampleGifFileList[0],
  });
  expect(() => mySchema.parse({ test: exampleHtmlFileList })).toThrowError(
    z.ZodError
  );
});

test("should throw proper error message when invalid input data (no options)", () => {
  const mySchema = z.object({
    test: zFile(),
  });

  const items = [null, {}, "test", true, false];
  for (const item of items)
    expect(tryToGetZodErrorMsg(() => mySchema.parse({ test: item }))).toEqual(
      "Invalid input"
    );
});

test("should throw proper error message when file is not provided and required opt is set", () => {
  const mySchema = z.object({
    test: zFile({
      required: true,
    }),
  });

  expect(
    tryToGetZodErrorMsg(() => mySchema.parse({ test: undefined }))
  ).toEqual("invalid");
  expect(tryToGetZodErrorMsg(() => mySchema.parse({ test: [] }))).toEqual(
    "required"
  );
});

test("should throw proper error message when input file has invalid extension (accept option is set)", () => {
  const mySchema = z.object({
    test: zFile({
      accept: ["image/png", "image/gif"],
    }),
  });

  const examplePngFileList = createDummyFileList([
    { name: "test.png", type: "image/png" },
  ]);
  const exampleGifFileList = createDummyFileList([
    { name: "test.jpg", type: "image/jpg" },
  ]);
  const exampleHtmlFileList = createDummyFileList([
    { name: "test.html", type: "text/html" },
  ]);

  expect(mySchema.parse({ test: examplePngFileList })).toEqual({
    test: examplePngFileList[0],
  });
  expect(
    tryToGetZodErrorMsg(() => mySchema.parse({ test: exampleGifFileList }))
  ).toEqual("unsupportedFormat|formats=png, gif");
  expect(
    tryToGetZodErrorMsg(() => mySchema.parse({ test: exampleHtmlFileList }))
  ).toEqual("unsupportedFormat|formats=png, gif");
});

test("should throw proper error message when input file is too big (maxSize option is set)", () => {
  const mySchema = z.object({
    test: zFile({
      maxSize: 1024 * 1024 * 5,
    }),
  });

  const examplePngFileList = createDummyFileList([
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 4 },
  ]);
  const exampleGifFileList = createDummyFileList([
    { name: "test.gif", type: "image/gif", size: 1024 * 1024 * 7 },
  ]);
  const exampleHtmlFileList = createDummyFileList([
    { name: "test.html", type: "text/html", size: 1024 * 1024 * 6 },
  ]);

  expect(mySchema.parse({ test: examplePngFileList })).toEqual({
    test: examplePngFileList[0],
  });
  expect(
    tryToGetZodErrorMsg(() => mySchema.parse({ test: exampleGifFileList }))
  ).toEqual("fileIsTooBig|max=5");
  expect(
    tryToGetZodErrorMsg(() => mySchema.parse({ test: exampleHtmlFileList }))
  ).toEqual("fileIsTooBig|max=5");
});
