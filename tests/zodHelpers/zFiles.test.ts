import * as z from "zod";
import { tryToGetZodErrorMsg } from "../utils/tryToGetZodErrorMsg";
import { createDummyFileList } from "../utils/createDummyFileList";
import { zFiles } from "../../src/utils/zodSchemaHelpers/zFiles";

const exampleFileList = createDummyFileList([
  { name: "test.html", type: "text/html" },
]);

const exampleFileListWithTwoFiles = createDummyFileList([
  { name: "test.html", type: "text/html" },
  { name: "test.png", type: "image/png" },
]);

const exampleFileListWithThreeFiles = createDummyFileList([
  { name: "test.html", type: "text/html" },
  { name: "test.png", type: "image/png" },
  { name: "test.png", type: "image/png" },
]);

test("should properly parse valid input data (no options)", () => {
  const mySchema = z.object({
    test: zFiles(),
  });

  expect(mySchema.parse({ test: undefined })).toEqual({ test: undefined });
  expect(mySchema.parse({ test: [] })).toEqual({ test: [] });
  expect(mySchema.parse({ test: exampleFileList })).toEqual({
    test: exampleFileList,
  });
  expect(mySchema.parse({ test: exampleFileListWithTwoFiles })).toEqual({
    test: exampleFileListWithTwoFiles,
  });
  expect(mySchema.parse({ test: exampleFileListWithThreeFiles })).toEqual({
    test: exampleFileListWithThreeFiles,
  });
});

test("should require min amount of files if minAmount option provided", () => {
  const mySchema = z.object({
    test: zFiles({
      minAmount: 1,
    }),
  });

  expect(mySchema.parse({ test: exampleFileList })).toEqual({
    test: exampleFileList,
  });
  expect(mySchema.parse({ test: exampleFileListWithTwoFiles })).toEqual({
    test: exampleFileListWithTwoFiles,
  });
  expect(() => mySchema.parse({ test: undefined })).toThrowError(z.ZodError);
  expect(() => mySchema.parse({ test: [] })).toThrowError(z.ZodError);
});

test("should throw error if input data is invalid", () => {
  const mySchema = z.object({
    test: zFiles(),
  });

  const items = [
    null,
    {},
    0,
    "test",
    true,
    false,
    new File([], "test.png", { type: "image/png" }),
  ];
  for (const item of items)
    expect(() => mySchema.parse({ test: item })).toThrowError(z.ZodError);

  const mySchemaTwo = z.object({
    test: zFiles({
      minAmount: 1,
    }),
  });

  const itemsTwo = [...items, undefined];
  for (const item of itemsTwo)
    expect(() => mySchemaTwo.parse({ test: item })).toThrowError(z.ZodError);
});

test("should throw error if at least one input file has invalid extension (accept option is set)", () => {
  const mySchema = z.object({
    test: zFiles({
      accept: ["image/png", "image/gif"],
    }),
  });

  const exampleWithValidItems = createDummyFileList([
    { name: "test.png", type: "image/png" },
    { name: "test.png", type: "image/png" },
  ]);
  const exampleWithValidMixedItems = createDummyFileList([
    { name: "test.png", type: "image/png" },
    { name: "test.png", type: "image/gif" },
  ]);
  const exampleWithInvalidItems = createDummyFileList([
    { name: "test.html", type: "text/html" },
  ]);
  const exampleWithInvalidMixedItems = createDummyFileList([
    { name: "test.html", type: "text/html" },
    { name: "test.png", type: "image/png" },
  ]);

  expect(mySchema.parse({ test: exampleWithValidItems })).toEqual({
    test: exampleWithValidItems,
  });
  expect(mySchema.parse({ test: exampleWithValidMixedItems })).toEqual({
    test: exampleWithValidMixedItems,
  });
  expect(() => mySchema.parse({ test: exampleWithInvalidItems })).toThrowError(
    z.ZodError
  );
  expect(() =>
    mySchema.parse({ test: exampleWithInvalidMixedItems })
  ).toThrowError(z.ZodError);

  const mySchemaTwo = z.object({
    test: zFiles({
      minAmount: 1,
      accept: ["image/png", "image/gif"],
    }),
  });

  expect(mySchemaTwo.parse({ test: exampleWithValidItems })).toEqual({
    test: exampleWithValidItems,
  });
  expect(mySchemaTwo.parse({ test: exampleWithValidMixedItems })).toEqual({
    test: exampleWithValidMixedItems,
  });
  expect(() =>
    mySchemaTwo.parse({ test: exampleWithInvalidItems })
  ).toThrowError(z.ZodError);
  expect(() =>
    mySchemaTwo.parse({ test: exampleWithInvalidMixedItems })
  ).toThrowError(z.ZodError);
});

test("should throw error if max size is exceeded in at least one file (maxSize option is set)", () => {
  const mySchema = z.object({
    test: zFiles({
      maxSize: 1024 * 1024 * 5,
    }),
  });

  const exampleWithAllValidItems = createDummyFileList([
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 4 },
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 3 },
  ]);
  const exampleWithOneInvalidItems = createDummyFileList([
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 4 },
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 6 },
  ]);
  const exampleWithAllInvalidItems = createDummyFileList([
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 7 },
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 6 },
  ]);

  expect(mySchema.parse({ test: exampleWithAllValidItems })).toEqual({
    test: exampleWithAllValidItems,
  });
  expect(() =>
    mySchema.parse({ test: exampleWithOneInvalidItems })
  ).toThrowError(z.ZodError);
  expect(() =>
    mySchema.parse({ test: exampleWithAllInvalidItems })
  ).toThrowError(z.ZodError);

  const mySchemaTwo = z.object({
    test: zFiles({
      minAmount: 1,
      maxSize: 1024 * 1024 * 5,
    }),
  });

  expect(mySchemaTwo.parse({ test: exampleWithAllValidItems })).toEqual({
    test: exampleWithAllValidItems,
  });
  expect(() =>
    mySchemaTwo.parse({ test: exampleWithOneInvalidItems })
  ).toThrowError(z.ZodError);
  expect(() =>
    mySchemaTwo.parse({ test: exampleWithAllInvalidItems })
  ).toThrowError(z.ZodError);
});

test("should throw proper error message when invalid input data", () => {
  const mySchema = z.object({
    test: zFiles(),
  });

  const items = [
    null,
    {},
    "test",
    true,
    false,
    new File([], "test.png", { type: "image/png" }),
  ];
  for (const item of items)
    expect(tryToGetZodErrorMsg(() => mySchema.parse({ test: item }))).toEqual(
      "invalid"
    );

  const mySchemaTwo = z.object({
    test: zFiles({
      minAmount: 1,
    }),
  });

  const itemsTwo = [...items, undefined];
  for (const item of itemsTwo)
    expect(
      tryToGetZodErrorMsg(() => mySchemaTwo.parse({ test: item }))
    ).toEqual("invalid");
});

test("should throw proper error message when minAmount is not fulfilled", () => {
  const mySchema = z.object({
    test: zFiles({
      minAmount: 2,
    }),
  });

  expect(
    tryToGetZodErrorMsg(() => mySchema.parse({ test: undefined }))
  ).toEqual("invalid");
  expect(tryToGetZodErrorMsg(() => mySchema.parse({ test: [] }))).toEqual(
    "tooFewElements|min=2"
  );
  expect(
    tryToGetZodErrorMsg(() => mySchema.parse({ test: exampleFileList }))
  ).toEqual("tooFewElements|min=2");
  expect(mySchema.parse({ test: exampleFileListWithThreeFiles })).toEqual({
    test: exampleFileListWithThreeFiles,
  });
});

test("should throw proper error message when at least one input file has invalid extension (accept option is set)", () => {
  const mySchema = z.object({
    test: zFiles({
      accept: ["image/png", "image/gif"],
    }),
  });

  const exampleWithValidItems = createDummyFileList([
    { name: "test.png", type: "image/png" },
    { name: "test.png", type: "image/png" },
  ]);
  const exampleWithValidMixedItems = createDummyFileList([
    { name: "test.png", type: "image/png" },
    { name: "test.png", type: "image/gif" },
  ]);
  const exampleWithInvalidItems = createDummyFileList([
    { name: "test.html", type: "text/html" },
  ]);
  const exampleWithInvalidMixedItems = createDummyFileList([
    { name: "test.html", type: "text/html" },
    { name: "test.png", type: "image/png" },
  ]);

  expect(mySchema.parse({ test: exampleWithValidItems })).toEqual({
    test: exampleWithValidItems,
  });
  expect(mySchema.parse({ test: exampleWithValidMixedItems })).toEqual({
    test: exampleWithValidMixedItems,
  });
  expect(
    tryToGetZodErrorMsg(() => mySchema.parse({ test: exampleWithInvalidItems }))
  ).toEqual("unsupportedFormat|formats=png, gif");
  expect(
    tryToGetZodErrorMsg(() =>
      mySchema.parse({ test: exampleWithInvalidMixedItems })
    )
  ).toEqual("unsupportedFormat|formats=png, gif");

  const mySchemaTwo = z.object({
    test: zFiles({
      minAmount: 1,
      accept: ["image/png", "image/gif"],
    }),
  });

  expect(mySchemaTwo.parse({ test: exampleWithValidItems })).toEqual({
    test: exampleWithValidItems,
  });
  expect(mySchemaTwo.parse({ test: exampleWithValidMixedItems })).toEqual({
    test: exampleWithValidMixedItems,
  });
  expect(
    tryToGetZodErrorMsg(() =>
      mySchemaTwo.parse({ test: exampleWithInvalidItems })
    )
  ).toEqual("unsupportedFormat|formats=png, gif");
  expect(
    tryToGetZodErrorMsg(() =>
      mySchemaTwo.parse({ test: exampleWithInvalidMixedItems })
    )
  ).toEqual("unsupportedFormat|formats=png, gif");
});

test("should throw proper error message when at least one input file is too big (maxSize option is set)", () => {
  const mySchema = z.object({
    test: zFiles({
      maxSize: 1024 * 1024 * 5,
    }),
  });

  const exampleWithAllValidItems = createDummyFileList([
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 4 },
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 3 },
  ]);
  const exampleWithOneInvalidItems = createDummyFileList([
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 4 },
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 6 },
  ]);
  const exampleWithAllInvalidItems = createDummyFileList([
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 7 },
    { name: "test.png", type: "image/png", size: 1024 * 1024 * 6 },
  ]);

  expect(mySchema.parse({ test: exampleWithAllValidItems })).toEqual({
    test: exampleWithAllValidItems,
  });
  expect(
    tryToGetZodErrorMsg(() =>
      mySchema.parse({ test: exampleWithOneInvalidItems })
    )
  ).toEqual("fileIsTooBig|max=5");
  expect(
    tryToGetZodErrorMsg(() =>
      mySchema.parse({ test: exampleWithAllInvalidItems })
    )
  ).toEqual("fileIsTooBig|max=5");

  const mySchemaTwo = z.object({
    test: zFiles({
      minAmount: 1,
      maxSize: 1024 * 1024 * 5,
    }),
  });

  expect(mySchemaTwo.parse({ test: exampleWithAllValidItems })).toEqual({
    test: exampleWithAllValidItems,
  });
  expect(
    tryToGetZodErrorMsg(() =>
      mySchemaTwo.parse({ test: exampleWithOneInvalidItems })
    )
  ).toEqual("fileIsTooBig|max=5");
  expect(
    tryToGetZodErrorMsg(() =>
      mySchemaTwo.parse({ test: exampleWithAllInvalidItems })
    )
  ).toEqual("fileIsTooBig|max=5");
});
