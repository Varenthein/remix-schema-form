import { expectType } from "tsd";
import {
  AnyFormFieldsSchema,
  BaseFormFieldSchema,
  BaseFormFieldsSchema,
  FieldAdditionalValidators,
  FieldServerValidators,
  FormFieldComponent,
  FormFieldsSchemas,
  OptionsForBasicType,
  OptionsForType,
  OptionsTranslationConfigBase,
  OptionsTranslationConfigCustom,
  RecursiveOption,
  ValidatedFormBaseComponents,
  ValidatedFormComponents,
  ValidatedFormFieldsComponentsObj,
  type FormFieldOptions,
  type FormFieldSchema,
} from "../src/utils/types";
import * as z from "zod";
import type {
  BasicFieldsSchemas,
  BasicSupportedFieldType,
} from "../src/config";

test("Tests for types can run properly", () => {
  // some of the tests check types that rely internally on BasicSupportedFields
  // e.g. we assume that "text" field is always valid one and in fact expects specific optional "options"
  // so we expect that type "Example" will be ok for "text" field and invalid for "invalidType" and so on...
  // in fact it won't likely change, but... for our own safety, we should expect that it can
  // and as we can't mock them, we should make sure that they look like they should before we go any further
  // thanks to that if change something in our basic fields, TS will quickly warn us
  // so we can make needed changes in the tests

  // check if at least two basic types (text and password) exist and have possible options that we are expecting
  expectType<BasicSupportedFieldType>("text");
  expectType<BasicSupportedFieldType>("password");

  expectType<
    Extract<BasicFieldsSchemas<string>, { type: "text" }> extends {
      options?: {
        role?: "text" | "email" | "search" | "tel" | "url";
        placeholder?: string;
      };
    }
      ? true
      : false
  >(true);
  expectType<
    Extract<BasicFieldsSchemas<string>, { type: "password" }> extends {
      options?: {
        role: "passwordRepeat";
      };
    }
      ? true
      : false
  >(true);

  // check if "invalidType" doesn't exist
  // as we want to use it as wrong type name that should raise errors
  // @ts-expect-error
  expectType<BasicSupportedFieldType>("invalidType");
});

test("Type FormFieldOptions works properly", () => {
  // Valid options

  expectTypeOf({
    str: "str",
    num: 0,
    bool: true,
    date: new Date(),
  }).toMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    str: "str",
    num: 0,
    bool: true,
    date: new Date(),
    obj: {
      str: "str",
      num: 0,
      bool: true,
      date: new Date(),
    },
  }).toMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    str: ["str", "foo", "bar"],
    num: [0, 2, 3, 4],
    bool: [true, false, true],
    date: [new Date(), new Date()],
    obj: [
      {
        str: "str",
        num: 0,
        bool: true,
        date: new Date(),
      },
      {
        str: ["str", "foo", "bar"],
        num: [0, 2, 3, 4],
        bool: [true, false, true],
        date: [new Date(), new Date()],
      },
    ],
  }).toMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    obj: [
      {
        obj: [
          {
            str: "str",
            num: 0,
            bool: true,
            date: new Date(),
          },
          {
            str: ["str", "foo", "bar"],
            num: [0, 2, 3, 4],
            bool: [true, false, true],
            date: [new Date(), new Date()],
          },
        ],
      },
    ],
  }).toMatchTypeOf<FormFieldOptions>();

  // Invalid options

  expectTypeOf({
    test: function () {},
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: null,
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: undefined,
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: Symbol,
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: [function () {}],
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: [null],
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: [undefined],
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: [Symbol],
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    obj: {
      test: function () {},
    },
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    obj: {
      test: null,
    },
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    obj: {
      test: undefined,
    },
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    obj: {
      test: Symbol,
    },
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    obj: {
      test: [function () {}],
    },
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    obj: {
      test: [null],
    },
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    obj: {
      test: [undefined],
    },
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    obj: {
      test: [Symbol],
    },
    // @ts-expect-error
  }).toNotMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: ["str", 1, "bar"],
    // @ts-expect-error
  }).toMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: ["str", new Date(), "bar"],
    // @ts-expect-error
  }).toMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: [true, new Date()],
    // @ts-expect-error
  }).toMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: [2, new Date()],
    // @ts-expect-error
  }).toMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: [{ a: "test" }, new Date()],
    // @ts-expect-error
  }).toMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: [{ a: "test" }, "test"],
    // @ts-expect-error
  }).toMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: [{ a: "test" }, 56],
    // @ts-expect-error
  }).toMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: [{ a: "test" }, true],
    // @ts-expect-error
  }).toMatchTypeOf<FormFieldOptions>();

  expectTypeOf({
    test: [[]],
    // @ts-expect-error
  }).toMatchTypeOf<FormFieldOptions>();
});

test("Type FormFieldsSchema works properly", () => {
  // Valid variants

  expectTypeOf({
    label: "a",
    type: "testType" as const,
    required: true,
    disabled: false,
    validation: z.string(),
    conditioned: (data: object) => (data ? true : false),
  }).toMatchTypeOf<FormFieldSchema<"testType", string, void>>();

  expectTypeOf({
    label: "a",
    type: "testType" as const,
    validation: z.number(),
  }).toMatchTypeOf<FormFieldSchema<"testType", string, void>>();

  expectTypeOf({
    label: "a",
    type: "testType" as const,
    validation: z.number(),
    options: {
      foo: "test",
    },
  }).toMatchTypeOf<
    FormFieldSchema<
      "testType",
      string,
      {
        options: {
          foo: string;
        };
      }
    >
  >();

  expectTypeOf({
    label: "a",
    type: "testType" as const,
    validation: z.number(),
  }).toMatchTypeOf<
    FormFieldSchema<
      "testType",
      string,
      {
        options?: {
          foo?: string;
        };
      }
    >
  >();

  expectTypeOf({
    label: "a",
    type: "testType" as const,
    validation: z.number(),
    options: {
      foo: "test",
    },
  }).toMatchTypeOf<
    FormFieldSchema<
      "testType",
      string,
      {
        options?: {
          foo?: string;
        };
      }
    >
  >();

  expectTypeOf({
    label: "a" as const,
    type: "testType" as const,
    required: true,
    disabled: false,
    validation: z.string(),
    conditioned: (data: object) => (data ? true : false),
  }).toMatchTypeOf<FormFieldSchema<"testType", "a" | "b", void>>();

  // Invalid variants

  expectTypeOf({
    label: "a",
    type: "abc" as const,
    required: true,
    disabled: false,
    validation: z.string(),
    conditioned: (data: object) => (data ? true : false),
    // @ts-expect-error
  }).toMatchTypeOf<FormFieldSchema<"testType", string, void>>();

  expectTypeOf({
    label: "a",
    type: "testType" as const,
    validation: z.number(),
    // @ts-expect-error
  }).toMatchTypeOf<
    FormFieldSchema<
      "testType",
      string,
      {
        options: {
          foo: string;
        };
      }
    >
  >();

  expectTypeOf({
    label: "a",
    type: "testType" as const,
    validation: z.number(),
    options: {
      bar: "test",
    },
    // @ts-expect-error
  }).toMatchTypeOf<
    FormFieldSchema<
      "testType",
      string,
      {
        options: {
          foo: string;
        };
      }
    >
  >();

  expectTypeOf({
    label: "a",
    type: "testType" as const,
    validation: z.number(),
    options: {
      foo: 2,
    },
    // @ts-expect-error
  }).toMatchTypeOf<
    FormFieldSchema<
      "testType",
      string,
      {
        options?: {
          foo?: string;
        };
      }
    >
  >();

  expectTypeOf({
    label: "c" as const,
    type: "testType" as const,
    required: true,
    disabled: false,
    validation: z.string(),
    conditioned: (data: object) => (data ? true : false),
    // @ts-expect-error
  }).toMatchTypeOf<FormFieldSchema<"testType", "a" | "b", void>>();
});

test("Type AnyFormFieldsSchema works properly", () => {
  // Valid variants

  expectTypeOf({
    test: {
      label: "test",
      type: "text",
      required: true,
      disabled: false,
      validation: z.string(),
      conditioned: (data: object) => (data ? true : false),
    },
    testTwo: {
      label: "testTwo",
      type: "password",
      validation: z.string(),
    },
  }).toMatchTypeOf<AnyFormFieldsSchema>();

  expectTypeOf({
    test: {
      label: "test",
      type: "text",
      required: true,
      disabled: false,
      validation: z.string(),
      conditioned: (data: object) => (data ? true : false),
      options: {
        a: "Test",
        b: "testTwo",
      },
    },
    testTwo: {
      label: "testTwo",
      type: "password",
      validation: z.string(),
    },
  }).toMatchTypeOf<AnyFormFieldsSchema>();

  // Invalid variants

  expectTypeOf({
    test: {
      label: "test",
      type: "text",
      required: true,
      disabled: false,
    },
    // @ts-expect-error
  }).toMatchTypeOf<AnyFormFieldsSchema>();

  expectTypeOf({
    test: {
      type: "text",
      required: true,
      disabled: false,
      validation: z.number(),
    },
    // @ts-expect-error
  }).toMatchTypeOf<AnyFormFieldsSchema>();

  expectTypeOf({
    test: {
      label: "test",
      required: true,
      disabled: false,
      validation: z.number(),
    },
    // @ts-expect-error
  }).toMatchTypeOf<AnyFormFieldsSchema>();

  expectTypeOf({
    test: [],
    // @ts-expect-error
  }).toMatchTypeOf<AnyFormFieldsSchema>();

  expectTypeOf({
    test: undefined,
    // @ts-expect-error
  }).toMatchTypeOf<AnyFormFieldsSchema>();

  expectTypeOf({
    test: null,
    // @ts-expect-error
  }).toMatchTypeOf<AnyFormFieldsSchema>();

  expectTypeOf({
    test: "test",
    // @ts-expect-error
  }).toMatchTypeOf<AnyFormFieldsSchema>();

  expectTypeOf({
    test: [],
    // @ts-expect-error
  }).toMatchTypeOf<AnyFormFieldsSchema>();

  expectTypeOf({
    test: undefined,
    // @ts-expect-error
  }).toMatchTypeOf<AnyFormFieldsSchema>();

  expectTypeOf({
    test: null,
    // @ts-expect-error
  }).toMatchTypeOf<AnyFormFieldsSchema>();

  expectTypeOf({
    test: "test",
    // @ts-expect-error
  }).toMatchTypeOf<AnyFormFieldsSchema>();

  // @ts-expect-error
  expectTypeOf(null).toMatchTypeOf<AnyFormFieldsSchema>();

  // @ts-expect-error
  expectTypeOf(undefined).toMatchTypeOf<AnyFormFieldsSchema>();

  // @ts-expect-error
  expectTypeOf([]).toMatchTypeOf<AnyFormFieldsSchema>();

  // @ts-expect-error
  expectTypeOf("test").toMatchTypeOf<AnyFormFieldsSchema>();

  // @ts-expect-error
  expectTypeOf(56).toMatchTypeOf<AnyFormFieldsSchema>();
});

test("Type BaseFormFieldSchema works properly", () => {
  // Valid variants (using only basic field types)

  expectType<BaseFormFieldSchema<string>>({
    type: "text",
    label: "test",
    description: "Test",
    validation: z.string(),
  });

  expectType<BaseFormFieldSchema<string>>({
    type: "password",
    label: "test",
    description: "Test",
    validation: z.string(),
    options: {
      role: "passwordRepeat",
    },
  });

  expectType<BaseFormFieldSchema<"a" | "b">>({
    type: "password",
    label: "a",
    description: "b",
    validation: z.string(),
    options: {
      role: "passwordRepeat",
    },
  });

  // Valid variants (with additional example custom fields)

  expectType<BaseFormFieldSchema<string, FormFieldSchema<"custom", string>>>({
    type: "text",
    label: "test",
    description: "Test",
    validation: z.string(),
  });

  expectType<BaseFormFieldSchema<string, FormFieldSchema<"custom", string>>>({
    type: "custom",
    label: "test",
    description: "Test",
    validation: z.string(),
  });

  expectType<
    BaseFormFieldSchema<
      string,
      FormFieldSchema<
        "custom",
        string,
        {
          options: {
            testOpt: number;
          };
        }
      >
    >
  >({
    type: "custom",
    label: "test",
    description: "Test",
    validation: z.string(),
    options: {
      testOpt: 5,
    },
  });

  expectType<
    BaseFormFieldSchema<
      "a" | "b",
      FormFieldSchema<
        "custom",
        "a" | "b",
        {
          options: {
            testOpt: number;
          };
        }
      >
    >
  >({
    type: "custom",
    label: "a",
    description: "b",
    validation: z.string(),
    options: {
      testOpt: 5,
    },
  });

  // Invalid variants (using only basic field types)

  // @ts-expect-error
  expectType<BaseFormFieldSchema<string>>({
    type: "text",
    label: "test",
    description: "Test",
  });

  expectType<BaseFormFieldSchema<string>>({
    // @ts-expect-error
    type: "invalidType",
    label: "test",
    description: "Test",
    validation: z.string(),
  });

  // @ts-expect-error
  expectType<BaseFormFieldSchema<string>>({
    label: "test",
    description: "Test",
    validation: z.string(),
  });

  expectType<BaseFormFieldSchema<string>>({
    type: "password",
    label: "test",
    description: "Test",
    validation: z.string(),
    options: {
      // @ts-expect-error
      roleOther: "passwordRepeat",
    },
  });

  expectType<BaseFormFieldSchema<"a" | "b">>({
    type: "password",
    // @ts-expect-error
    label: "c",
    // @ts-expect-error
    description: "d",
    validation: z.string(),
    options: {
      role: "passwordRepeat",
    },
  });

  // Invalid variants (with additional example custom fields)

  // @ts-expect-error
  expectType<BaseFormFieldSchema<string, FormFieldSchema<"custom", string>>>({
    label: "test",
    description: "Test",
    validation: z.string(),
  });

  // @ts-expect-error
  expectType<BaseFormFieldSchema<string, FormFieldSchema<"custom", string>>>({
    type: "custom",
    label: "test",
    description: "Test",
  });

  expectType<
    BaseFormFieldSchema<
      string,
      FormFieldSchema<
        "custom",
        string,
        {
          options: {
            testOpt: number;
          };
          // @ts-expect-error
        }
      >
    >
  >({
    type: "custom",
    label: "test",
    description: "Test",
    validation: z.string(),
  });

  expectType<
    BaseFormFieldSchema<
      "a" | "b",
      FormFieldSchema<
        "custom",
        "a" | "b",
        {
          options: {
            testOpt: number;
          };
        }
      >
    >
  >({
    type: "custom",
    label: "a",
    description: "b",
    validation: z.string(),
    options: {
      // @ts-expect-error
      testOpt: "test",
    },
  });
});

test("Type BaseFormFieldsSchema works properly", () => {
  // Valid variants (using only basic field types)

  expectType<BaseFormFieldsSchema<string>>({
    test: {
      type: "text",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
    testTwo: {
      type: "password",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
  });

  expectType<BaseFormFieldsSchema<string>>({
    test: {
      type: "text",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
    testTwo: {
      type: "password",
      label: "test",
      description: "Test",
      validation: z.string(),
      options: {
        role: "passwordRepeat",
      },
    },
  });

  expectType<BaseFormFieldsSchema<"a" | "b">>({
    test: {
      type: "password",
      label: "a",
      description: "b",
      validation: z.string(),
      options: {
        role: "passwordRepeat",
      },
    },
  });

  // Valid variants (with additional example custom fields)

  expectType<BaseFormFieldsSchema<string, FormFieldSchema<"custom", string>>>({
    test: {
      type: "text",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
    testTwo: {
      type: "custom",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
  });

  expectType<
    BaseFormFieldsSchema<
      string,
      FormFieldSchema<
        "custom",
        string,
        {
          options: {
            testOpt: number;
          };
        }
      >
    >
  >({
    test: {
      type: "text",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
    testTwo: {
      type: "custom",
      label: "test",
      description: "Test",
      validation: z.string(),
      options: {
        testOpt: 2,
      },
    },
  });

  expectType<
    BaseFormFieldsSchema<
      string,
      FormFieldSchema<
        "custom",
        string,
        {
          options?: {
            testOpt?: number;
          };
        }
      >
    >
  >({
    test: {
      type: "text",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
    testTwo: {
      type: "custom",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
  });

  expectType<
    BaseFormFieldsSchema<
      "a" | "b",
      FormFieldSchema<
        "custom",
        "a" | "b",
        {
          options?: {
            testOpt?: number;
          };
        }
      >
    >
  >({
    test: {
      type: "text",
      label: "a",
      description: "a",
      validation: z.string(),
    },
    testTwo: {
      type: "custom",
      label: "b",
      description: "b",
      validation: z.string(),
    },
  });

  // Invalid variants

  // @ts-expect-error
  expectType<BaseFormFieldsSchema<string>>(null);

  // @ts-expect-error
  expectType<BaseFormFieldsSchema<string>>(undefined);

  // @ts-expect-error
  expectType<BaseFormFieldsSchema<string>>([]);

  // @ts-expect-error
  expectType<BaseFormFieldsSchema<string>>(true);

  // @ts-expect-error
  expectType<BaseFormFieldsSchema<string>>(false);

  // @ts-expect-error
  expectType<BaseFormFieldsSchema<string>>(0);

  // @ts-expect-error
  expectType<BaseFormFieldsSchema<string>>("test");

  expectType<BaseFormFieldsSchema<string>>({
    // @ts-expect-error
    test: null,
  });

  expectType<BaseFormFieldsSchema<string>>({
    // @ts-expect-error
    test: undefined,
  });

  expectType<BaseFormFieldsSchema<string>>({
    // @ts-expect-error
    test: function () {},
  });

  expectType<BaseFormFieldsSchema<string>>({
    // @ts-expect-error
    test: [],
  });

  expectType<BaseFormFieldsSchema<string>>({
    // @ts-expect-error
    test: 8,
  });

  expectType<BaseFormFieldsSchema<string>>({
    // @ts-expect-error
    test: "test",
  });

  expectType<BaseFormFieldsSchema<string>>({
    // @ts-expect-error
    test: {
      label: "test",
      description: "Test",
      validation: z.string(),
    },
    testTwo: {
      type: "password",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
  });

  expectType<BaseFormFieldsSchema<string>>({
    // @ts-expect-error
    test: {
      type: "text",
      label: "test",
      description: "Test",
    },
    testTwo: {
      type: "password",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
  });

  expectType<BaseFormFieldsSchema<string>>({
    test: {
      // @ts-expect-error
      type: "invalidType",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
    testTwo: {
      type: "password",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
  });

  expectType<BaseFormFieldsSchema<string>>({
    test: {
      type: "text",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
    testTwo: {
      type: "password",
      label: "test",
      description: "Test",
      validation: z.string(),
      options: {
        // @ts-expect-error
        roleInvalid: "passwordRepeat",
      },
    },
  });

  expectType<BaseFormFieldsSchema<string>>({
    test: {
      type: "text",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
    testTwo: {
      type: "password",
      label: "test",
      description: "Test",
      validation: z.string(),
      options: {
        // @ts-expect-error
        role: "test",
      },
    },
  });

  expectType<BaseFormFieldsSchema<"a" | "b">>({
    test: {
      type: "password",
      // @ts-expect-error
      label: "c",
      // @ts-expect-error
      description: "d",
      validation: z.string(),
      options: {
        role: "passwordRepeat",
      },
    },
  });

  expectType<BaseFormFieldsSchema<string, FormFieldSchema<"custom", string>>>({
    // @ts-expect-error
    test: {
      label: "test",
      description: "Test",
      validation: z.string(),
    },
    testTwo: {
      type: "custom",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
  });

  expectType<
    BaseFormFieldsSchema<
      string,
      FormFieldSchema<
        "custom",
        string,
        {
          options: {
            testOpt: number;
          };
        }
      >
    >
  >({
    // @ts-expect-error
    test: {
      type: "text",
      label: "test",
      description: "Test",
    },
    testTwo: {
      type: "custom",
      label: "test",
      description: "Test",
      validation: z.string(),
      options: {
        testOpt: 2,
      },
    },
  });

  expectType<
    BaseFormFieldsSchema<
      string,
      FormFieldSchema<
        "custom",
        string,
        {
          options: {
            testOpt: number;
          };
        }
      >
    >
  >({
    test: {
      // @ts-expect-error
      type: "invalidType",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
    testTwo: {
      type: "custom",
      label: "test",
      description: "Test",
      validation: z.string(),
      options: {
        testOpt: 2,
      },
    },
  });

  expectType<
    BaseFormFieldsSchema<
      string,
      FormFieldSchema<
        "custom",
        string,
        {
          options: {
            testOpt: number;
          };
        }
      >
    >
  >({
    test: {
      type: "text",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
    // @ts-expect-error
    testTwo: {
      type: "custom",
      label: "test",
      description: "Test",
      validation: z.string(),
    },
  });

  expectType<
    BaseFormFieldsSchema<
      "a" | "b",
      FormFieldSchema<
        "custom",
        "a" | "b",
        {
          options?: {
            testOpt?: number;
          };
        }
      >
    >
  >({
    test: {
      type: "text",
      label: "a",
      description: "a",
      validation: z.string(),
    },
    testTwo: {
      type: "custom",
      // @ts-expect-error
      label: "c",
      // @ts-expect-error
      description: "d",
      validation: z.string(),
    },
  });
});

test("Type OptionsForBasicType works properly", () => {
  // Valid variants

  expectType<OptionsForBasicType<"text">>({});

  expectType<OptionsForBasicType<"text">>({ role: "text" });

  expectType<OptionsForBasicType<"date">>({ minDate: new Date() });

  // Invalid variants

  // @ts-expect-error
  expectType<OptionsForBasicType<"invalidType">>({});

  // @ts-expect-error
  expectType<OptionsForBasicType<"text">>({ invalid: true });
});

test("Type OptionsForType works properly", () => {
  // Valid variants

  expectType<
    OptionsForType<
      "text",
      {
        type: "custom";
        label: string;
        options: {
          test: number;
        };
      }
    >
  >({});

  expectType<
    OptionsForType<
      "text",
      {
        type: "custom";
        label: string;
        options: {
          test: number;
        };
      }
    >
  >({ role: "text" });

  expectType<OptionsForType<"date", FormFieldSchema<"custom", string>>>({
    minDate: new Date(),
  });

  expectType<
    OptionsForType<
      "custom",
      FormFieldSchema<
        "custom",
        string,
        {
          options: {
            test: number;
          };
        }
      >
    >
  >({ test: 5 });

  expectType<
    OptionsForType<
      "custom",
      FormFieldSchema<
        "custom",
        string,
        {
          options?: {
            test?: number;
          };
        }
      >
    >
  >({});

  // Invalid variants

  // @ts-expect-error
  expectType<OptionsForType<"invalidType">>({});

  // @ts-expect-error
  expectType<OptionsForType<"text">>({ invalid: true });

  // @ts-expect-error
  expectType<OptionsForType<"invalidType", FormFieldSchema<"custom", string>>>(
    {}
  );

  expectType<
    OptionsForType<
      "custom",
      FormFieldSchema<
        "custom",
        string,
        {
          options: {
            test: number;
          };
          // @ts-expect-error
        }
      >
    >
  >({ test: "abc" });

  expectType<
    OptionsForType<
      "custom",
      FormFieldSchema<
        "custom",
        string,
        {
          options: {
            test: number;
          };
          // @ts-expect-error
        }
      >
    >
  >({});
});

test("Type ValidatedFormBaseComponents works properly", () => {
  // Valid variants

  // check if the type requires to assign components to all declared field types and additional ones (message, submitBtn)
  expectType<
    Pick<
      ValidatedFormBaseComponents,
      "text" | "password" | "message" | "submitBtn"
    >
  >({
    text: (args: any) => null,
    password: (args: any) => null,
    message: (args: any) => null,
    submitBtn: (args) => null,
  });

  // check if comp params are properly typed
  expectType<ValidatedFormBaseComponents["text"]>(
    ({ options: { role, placeholder } }) => null
  );
  expectType<ValidatedFormBaseComponents["password"]>(({ options: { role } }) =>
    role === "passwordRepeat" ? null : null
  );
  expectType<ValidatedFormBaseComponents["text"]>(
    ({
      label,
      description,
      options,
      error,
      fieldName,
      register,
      required,
      disabled,
      className,
      control,
    }) => null
  );
  expectType<ValidatedFormBaseComponents["password"]>(
    ({
      label,
      description,
      options,
      error,
      fieldName,
      register,
      required,
      disabled,
      className,
      control,
    }) => null
  );
  expectType<ValidatedFormBaseComponents["message"]>(
    ({ variant, items, children }) =>
      ["error", "success"].includes(variant) ? null : null
  );
  expectType<ValidatedFormBaseComponents["submitBtn"]>(
    ({ type, isSubmitting, children }) =>
      ["button", "submit", "error"].includes(type) ? null : null
  );

  // Invalid variants

  // check if the TS raises error when param for field or submitBtn/message is missing

  // @ts-expect-error
  expectType<
    Pick<
      ValidatedFormBaseComponents,
      "text" | "password" | "message" | "submitBtn"
    >
  >({
    text: (args: any) => null,
    message: (args: any) => null,
    submitBtn: (args) => null,
  });

  // @ts-expect-error
  expectType<
    Pick<
      ValidatedFormBaseComponents,
      "text" | "password" | "message" | "submitBtn"
    >
  >({
    text: (args: any) => null,
    password: (args: any) => null,
    submitBtn: (args) => null,
  });

  // @ts-expect-error
  expectType<
    Pick<
      ValidatedFormBaseComponents,
      "text" | "password" | "message" | "submitBtn"
    >
  >({
    text: (args: any) => null,
    password: (args: any) => null,
    message: (args: any) => null,
  });

  // check if comp params are properly typed (TS should want us if we try to use invalid names)
  expectType<ValidatedFormBaseComponents["text"]>(
    ({
      options: {
        // @ts-expect-error
        invalidOption,
        placeholder,
      },
    }) => null
  );
  expectType<ValidatedFormBaseComponents["password"]>(
    ({
      options: {
        // @ts-expect-error
        invalidOption,
      },
    }) => null
  );
  expectType<ValidatedFormBaseComponents["password"]>(
    ({
      options: {
        role,
        // @ts-expect-error
      },
    }) => (role === "invalidValue" ? null : null)
  );
  expectType<ValidatedFormBaseComponents["text"]>(
    ({
      label,
      description,
      options,
      error,
      fieldName,
      register,
      required,
      disabled,
      className,
      control,
      // @ts-expect-error
      invalidArg,
    }) => null
  );
  expectType<ValidatedFormBaseComponents["password"]>(
    ({
      label,
      description,
      options,
      error,
      fieldName,
      register,
      required,
      disabled,
      className,
      control,
      // @ts-expect-error
      invalidArg,
    }) => null
  );
  expectType<ValidatedFormBaseComponents["message"]>(
    ({
      variant,
      items,
      children,
      // @ts-expect-error
    }) => (variant === "invalidValue" ? null : null)
  );
  expectType<ValidatedFormBaseComponents["submitBtn"]>(
    ({
      type,
      isSubmitting,
      children,
      // @ts-expect-error
    }) => (type === "invalidValue" ? null : null)
  );
});

test("Type ValidatedFormComponents works properly", () => {
  // Valid variants

  // check if the type requires to assign components to all declared field types (custom ones as well) and additional ones (message, submitBtn)
  expectType<
    Pick<
      ValidatedFormComponents<
        { customType: any },
        { customType: FormFieldSchema<"customType", string, void> }
      >,
      "customType" | "text" | "password" | "message" | "submitBtn"
    >
  >({
    text: (args: any) => null,
    password: (args: any) => null,
    message: (args: any) => null,
    submitBtn: (args: any) => null,
    customType: (args: any) => null,
  });

  // check if comp params are properly typed
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["text"]
  >(({ options: { role, placeholder } }) => null);
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["password"]
  >(({ options: { role } }) => (role === "passwordRepeat" ? null : null));
  expectType<
    ValidatedFormComponents<
      { customType: any },
      FormFieldsSchemas<
        "customType",
        string,
        {
          customType: {
            options?: {
              validOption: "validValue";
            };
          };
        }
      >
    >["customType"]
  >(({ options: { validOption } }) =>
    validOption === "validValue" ? null : null
  );

  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["text"]
  >(
    ({
      label,
      description,
      options,
      error,
      fieldName,
      register,
      required,
      disabled,
      className,
      control,
    }) => null
  );
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["password"]
  >(
    ({
      label,
      description,
      options,
      error,
      fieldName,
      register,
      required,
      disabled,
      className,
      control,
    }) => null
  );
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["customType"]
  >(
    ({
      label,
      description,
      options,
      error,
      fieldName,
      register,
      required,
      disabled,
      className,
      control,
    }) => null
  );
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["message"]
  >(({ variant, items, children }) =>
    ["error", "success"].includes(variant) ? null : null
  );
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["submitBtn"]
  >(({ type, isSubmitting, children }) =>
    ["button", "submit", "error"].includes(type) ? null : null
  );

  // Invalid variants

  // check if the TS raises error when param for field or submitBtn/message is missing

  expectType<
    Pick<
      ValidatedFormComponents<
        { customType: any },
        { customType: FormFieldSchema<"customType", string, void> }
        // @ts-expect-error
      >,
      "customType" | "text" | "password" | "message" | "submitBtn"
    >
  >({
    text: (args: any) => null,
    message: (args: any) => null,
    submitBtn: (args) => null,
  });

  expectType<
    Pick<
      ValidatedFormComponents<
        { customType: any },
        { customType: FormFieldSchema<"customType", string, void> }
        // @ts-expect-error
      >,
      "customType" | "text" | "password" | "message" | "submitBtn"
    >
  >({
    text: (args: any) => null,
    password: (args: any) => null,
    message: (args: any) => null,
    submitBtn: (args) => null,
  });

  expectType<
    Pick<
      ValidatedFormComponents<
        { customType: any },
        { customType: FormFieldSchema<"customType", string, void> }
        // @ts-expect-error
      >,
      "customType" | "text" | "password" | "message" | "submitBtn"
    >
  >({
    password: (args: any) => null,
    customType: (args: any) => null,
    message: (args: any) => null,
    submitBtn: (args) => null,
  });

  // check if comp params are properly typed (TS should want us if we try to use invalid names)
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["text"]
  >(
    ({
      options: {
        // @ts-expect-error
        invalidOption,
        placeholder,
      },
    }) => null
  );
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["password"]
  >(
    ({
      options: {
        // @ts-expect-error
        invalidOption,
      },
    }) => null
  );
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["password"]
  >(
    ({
      options: {
        role,
        // @ts-expect-error
      },
    }) => (role === "invalidValue" ? null : null)
  );
  expectType<
    ValidatedFormComponents<
      { customType: any },
      FormFieldsSchemas<
        "customType",
        string,
        {
          customType: {
            options?: {
              validOption: "validValue";
            };
          };
        }
      >
    >["customType"]
  >(
    ({
      options: {
        validOption,
        // @ts-expect-error
      },
    }) => (validOption === "invalidValue" ? null : null)
  );
  expectType<
    ValidatedFormComponents<
      { customType: any },
      FormFieldsSchemas<
        "customType",
        string,
        {
          customType: {
            options?: {
              validOption: "validValue";
            };
          };
        }
      >
    >["customType"]
  >(
    ({
      options: {
        // @ts-expect-error
        invalidOption,
      },
    }) => null
  );
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["text"]
  >(
    ({
      label,
      description,
      options,
      error,
      fieldName,
      register,
      required,
      disabled,
      className,
      control,
      // @ts-expect-error
      invalidArg,
    }) => null
  );
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["password"]
  >(
    ({
      label,
      description,
      options,
      error,
      fieldName,
      register,
      required,
      disabled,
      className,
      control,
      // @ts-expect-error
      invalidArg,
    }) => null
  );
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["customType"]
  >(
    ({
      label,
      description,
      options,
      error,
      fieldName,
      register,
      required,
      disabled,
      className,
      control,
      // @ts-expect-error
      invalidArg,
    }) => null
  );
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["message"]
  >(
    ({
      variant,
      items,
      children,
      // @ts-expect-error
    }) => (variant === "invalidValue" ? null : null)
  );
  expectType<
    ValidatedFormComponents<
      { customType: any },
      { customType: FormFieldSchema<"customType", string, void> }
    >["submitBtn"]
  >(
    ({
      type,
      isSubmitting,
      children,
      // @ts-expect-error
    }) => (type === "invalidValue" ? null : null)
  );
});

test("Type FormFieldsSchemas works properly", () => {
  // Valid options

  // check if type allows declared field types
  expectType<
    FormFieldsSchemas<
      "customType" | "customTypeTwo",
      string,
      {
        customType: {};
        customTypeTwo: {};
      }
    >
  >({
    label: "test",
    type: "customType",
    validation: z.string(),
  });

  expectType<
    FormFieldsSchemas<
      "customType" | "customTypeTwo",
      string,
      {
        customType: {};
        customTypeTwo: {};
      }
    >
  >({
    label: "test",
    type: "customTypeTwo",
    validation: z.string(),
  });

  expectType<
    FormFieldsSchemas<
      "customType" | "customTypeTwo",
      string,
      {
        customType: {
          options: {
            validOption: "validValue";
          };
        };
        customTypeTwo: {};
      }
    >
  >({
    label: "test",
    type: "customType",
    validation: z.string(),
    options: {
      validOption: "validValue",
    },
  });

  expectType<
    FormFieldsSchemas<
      "customType" | "customTypeTwo",
      string,
      {
        customType: {
          options?: {
            validOption?: "validValue";
          };
        };
        customTypeTwo: {};
      }
    >
  >({
    label: "test",
    type: "customType",
    validation: z.string(),
  });

  expectType<
    FormFieldsSchemas<
      "customType" | "customTypeTwo",
      "a" | "b",
      {
        customType: {};
        customTypeTwo: {};
      }
    >
  >({
    label: "a",
    description: "b",
    type: "customType",
    validation: z.string(),
  });

  // Invalid variants

  // check if type doesn't allow not declared field types
  expectType<
    FormFieldsSchemas<
      "customType" | "customTypeTwo",
      string,
      {
        customType: {};
        customTypeTwo: {};
      }
    >
  >({
    label: "test",
    // @ts-expect-error
    type: "invalidType",
    validation: z.string(),
  });

  // check if TS warns us if option name or value is invalid
  expectType<
    FormFieldsSchemas<
      "customType" | "customTypeTwo",
      string,
      {
        customType: {
          options: {
            validOption: "validValue";
          };
        };
        customTypeTwo: {};
      }
    >
  >({
    label: "test",
    type: "customType",
    validation: z.string(),
    options: {
      // @ts-expect-error
      invalidOption: "validValue",
    },
  });

  expectType<
    FormFieldsSchemas<
      "customType" | "customTypeTwo",
      string,
      {
        customType: {
          options: {
            validOption: "validValue";
          };
        };
        customTypeTwo: {};
      }
    >
  >({
    label: "test",
    type: "customType",
    validation: z.string(),
    options: {
      // @ts-expect-error
      validOption: "invalidValue",
    },
  });

  // check if type requires required option
  expectType<
    FormFieldsSchemas<
      "customType" | "customTypeTwo",
      string,
      {
        customType: {
          options: {
            validOption: "validValue";
          };
        };
        customTypeTwo: {};
        // @ts-expect-error
      }
    >
  >({
    label: "test",
    type: "customType",
    validation: z.string(),
  });

  // check if type requires proper lang keys
  expectType<
    FormFieldsSchemas<
      "customType" | "customTypeTwo",
      "a" | "b",
      {
        customType: {};
        customTypeTwo: {};
      }
    >
  >({
    // @ts-expect-error
    label: "c",
    // @ts-expect-error
    description: "d",
    type: "customType",
    validation: z.string(),
  });
});

test("Type RecursiveOption works properly", () => {
  // Valid variants

  // check if we can set to translation only these fields that are present in field options
  // they should be always optional
  // we try to check different supported structures
  expectType<RecursiveOption<{ test: string }>>({ test: true });
  expectType<RecursiveOption<{ test: string }>>({});
  expectType<RecursiveOption<{ test: string[] }>>({ test: true });
  expectType<
    RecursiveOption<{
      test: {
        a: number;
        b: string;
      };
    }>
  >({
    test: {
      b: true,
    },
  });
  expectType<
    RecursiveOption<{
      test: {
        a: string;
        b: string;
      };
    }>
  >({
    test: {
      b: true,
    },
  });
  expectType<
    RecursiveOption<{
      test: {
        a: string;
        b: string;
      };
    }>
  >({
    test: {
      a: true,
      b: true,
    },
  });
  expectType<
    RecursiveOption<{
      test: {
        a: string;
        b: string;
      }[];
    }>
  >({
    test: {
      a: true,
      b: true,
    },
  });
  expectType<
    RecursiveOption<{
      test: {
        a: {
          c: string;
          d: string;
        };
        b: string;
      };
    }>
  >({
    test: {
      a: {
        c: true,
      },
      b: true,
    },
  });
  expectType<
    RecursiveOption<{
      test: {
        a: {
          c: string[];
          d: string;
        };
        b: string;
      };
    }>
  >({
    test: {
      a: {
        c: true,
        d: true,
      },
      b: true,
    },
  });

  // Invalid variants

  // @ts-expect-error
  expectType<RecursiveOption<{ test: string }>>({ invalidOption: true });
  // @ts-expect-error
  expectType<RecursiveOption<{ test: number }>>({ test: true });
  // @ts-expect-error
  expectType<RecursiveOption<{ test: boolean }>>({ test: true });
  // @ts-expect-error
  expectType<RecursiveOption<{ test: null }>>({ test: true });
  // @ts-expect-error
  expectType<RecursiveOption<{ test: () => null }>>({ test: true });
  // @ts-expect-error
  expectType<RecursiveOption<{ test: Date }>>({ test: new Date() });
  // @ts-expect-error
  expectType<RecursiveOption<{ test: number[] }>>({ test: true });
  // @ts-expect-error
  expectType<RecursiveOption<{ test: boolean[] }>>({ test: true });
  // @ts-expect-error
  expectType<RecursiveOption<{ test: null[] }>>({ test: true });
  // @ts-expect-error
  expectType<RecursiveOption<{ test: (() => null)[] }>>({ test: true });
  // @ts-expect-error
  expectType<RecursiveOption<{ test: Date[] }>>({ test: new Date() });
  expectType<
    RecursiveOption<{
      test: {
        a: number;
        b: string;
      };
    }>
  >({
    test: {
      // @ts-expect-error
      c: true,
    },
  });
  expectType<
    RecursiveOption<{
      test: {
        a: number;
        b: string;
      };
    }>
  >({
    test: {
      // @ts-expect-error
      a: true,
    },
  });
  expectType<
    RecursiveOption<{
      test: {
        a: number;
        b: string;
      }[];
    }>
  >({
    test: {
      // @ts-expect-error
      a: true,
      b: true,
    },
  });
  expectType<
    RecursiveOption<{
      test: {
        b: string;
      }[];
    }>
  >({
    test: {
      b: true,
      // @ts-expect-error
      c: true,
    },
  });
  expectType<
    RecursiveOption<{
      test: {
        a: {
          c: number;
        };
        b: string;
      };
    }>
  >({
    test: {
      a: {
        // @ts-expect-error
        c: true,
      },
      b: true,
    },
  });
  // @ts-expect-error
  expectType<RecursiveOption<{ obj: { test: string } }>>({
    invalidOption: true,
  });
  // @ts-expect-error
  expectType<RecursiveOption<{ obj: { test: number } }>>({ test: true });
  // @ts-expect-error
  expectType<RecursiveOption<{ obj: { test: boolean } }>>({ test: true });
  // @ts-expect-error
  expectType<RecursiveOption<{ obj: { test: null } }>>({ test: true });
  // @ts-expect-error
  expectType<RecursiveOption<{ obj: { test: () => null } }>>({ test: true });
  // @ts-expect-error
  expectType<RecursiveOption<{ obj: { test: Date } }>>({ test: new Date() });
});

test("Type OptionsTranslationConfigBase works properly", () => {
  // Disclaimer: OptionsTranslationConfigBase is only small wrapper for `RecursiveOptions` that is used for every basic field type
  // We check RecursiveOptions above, so here we should only check if possible options to translate indeed depend on field type

  expectType<Pick<OptionsTranslationConfigBase, "text" | "password">>({
    text: {
      placeholder: true,
    },
  });

  expectType<Pick<OptionsTranslationConfigBase, "text" | "password">>({
    text: {
      // @ts-expect-error
      invalidOption: true,
    },
  });

  expectType<Pick<OptionsTranslationConfigBase, "text" | "password">>({
    // @ts-expect-error
    invalidType: {},
  });

  test("Type OptionsTranslationConfigCustom works properly", () => {
    // Disclaimer: OptionsTranslationConfigCustom is only small wrapper for `RecursiveOptions` that is used for every basic field type
    // We check RecursiveOptions above, so here we should only check if possible options to translate indeed depend on field type

    expectType<
      OptionsTranslationConfigCustom<
        "customTypeOne" | "customTypeTwo",
        FormFieldsSchemas<
          "customTypeOne" | "customTypeTwo",
          string,
          {
            customTypeOne: {
              options: {
                test: string;
              };
            };
            customTypeTwo: {};
          }
        >
      >
    >({
      customTypeOne: {
        test: true,
      },
    });

    expectType<
      OptionsTranslationConfigCustom<
        "customTypeOne" | "customTypeTwo",
        FormFieldsSchemas<
          "customTypeOne" | "customTypeTwo",
          string,
          {
            customTypeOne: {
              options: {
                test: string;
              };
            };
            customTypeTwo: {};
          }
        >
      >
    >({
      // @ts-expect-error
      customTypeTwo: {
        test: true,
      },
    });

    expectType<
      OptionsTranslationConfigCustom<
        "customTypeOne" | "customTypeTwo",
        FormFieldsSchemas<
          "customTypeOne" | "customTypeTwo",
          string,
          {
            customTypeOne: {
              options: {
                test: string;
              };
            };
            customTypeTwo: {};
          }
        >
      >
    >({
      // @ts-expect-error
      invalidType: {},
    });
  });
});

test("Type OptionsTranslationConfigCustom works properly", () => {
  // Disclaimer: OptionsTranslationConfigCustom is only small wrapper for `RecursiveOptions` that is used for every basic field type
  // We check RecursiveOptions above, so here we should only check if possible options to translate indeed depend on field type

  expectType<
    OptionsTranslationConfigCustom<
      "customTypeOne" | "customTypeTwo",
      FormFieldsSchemas<
        "customTypeOne" | "customTypeTwo",
        string,
        {
          customTypeOne: {
            options: {
              test: string;
            };
          };
          customTypeTwo: {};
        }
      >
    >
  >({
    customTypeOne: {
      test: true,
    },
  });

  expectType<
    OptionsTranslationConfigCustom<
      "customTypeOne" | "customTypeTwo",
      FormFieldsSchemas<
        "customTypeOne" | "customTypeTwo",
        string,
        {
          customTypeOne: {
            options: {
              test: string;
            };
          };
          customTypeTwo: {};
        }
      >
    >
  >({
    // @ts-expect-error
    customTypeTwo: {
      test: true,
    },
  });

  expectType<
    OptionsTranslationConfigCustom<
      "customTypeOne" | "customTypeTwo",
      FormFieldsSchemas<
        "customTypeOne" | "customTypeTwo",
        string,
        {
          customTypeOne: {
            options: {
              test: string;
            };
          };
          customTypeTwo: {};
        }
      >
    >
  >({
    // @ts-expect-error
    invalidType: {},
  });
});

test("Type FieldAdditionalValidators works properly", () => {
  // Valid variants

  // check if type allows adding validation func for supported fields
  // check if this func has access to expected options and can return expected outcome
  expectType<FieldAdditionalValidators<"text" | "password", string>>({
    text: ({ schema, data, fieldName, value, options }) => null,
  });
  expectType<FieldAdditionalValidators<"text" | "password", string>>({
    text: ({ schema, data, fieldName, value, options }) =>
      options.placeholder === "" ? null : null,
    password: ({ schema, data, fieldName, value, options }) =>
      options.role === "passwordRepeat"
        ? {
            path: ["text"],
            message: "Error",
          }
        : null,
  });
  expectType<
    FieldAdditionalValidators<
      "text" | "customType",
      string,
      FormFieldsSchemas<
        "customType",
        string,
        {
          customType: {
            options: {
              test: string;
            };
          };
        }
      >
    >
  >({
    text: ({ schema, data, fieldName, value, options }) => null,
    customType: ({ schema, data, fieldName, value, options }) =>
      options.test
        ? null
        : {
            path: ["customType", "text"],
            message: "test",
          },
  });
  expectType<
    FieldAdditionalValidators<
      "text" | "customType",
      "a" | "b",
      FormFieldsSchemas<
        "customType",
        "a" | "b",
        {
          customType: {
            options: {
              test: string;
            };
          };
        }
      >
    >
  >({
    text: ({ schema, data, fieldName, value, options }) => null,
    customType: ({ schema, data, fieldName, value, options }) =>
      options.test
        ? null
        : {
            path: ["customType", "text"],
            message: "a",
          },
  });

  // Invalid variants

  // check if TS will warn us while trying to use unsupported fields or use them incorrectly
  expectType<FieldAdditionalValidators<"text" | "password", string>>({
    // @ts-expect-error
    invalidType: ({ schema, data, fieldName, value, options }) => null,
  });
  expectType<FieldAdditionalValidators<"text" | "password", string>>({
    // @ts-expect-error
    text: ({ schema, data, fieldName, value, options }) =>
      options.invalidOption === "value" ? null : null,
  });
  expectType<FieldAdditionalValidators<"text" | "password", string>>({
    // @ts-expect-error
    text: ({ schema, data, fieldName, value, options }) =>
      options.role === 22 ? null : null,
  });
  expectType<FieldAdditionalValidators<"text" | "password", string>>({
    // @ts-expect-error
    text: ({ schema, data, fieldName, value, options }) => ({
      path: ["invalidType"],
      message: "test",
    }),
  });
  expectType<
    FieldAdditionalValidators<
      "text" | "customType",
      string,
      FormFieldsSchemas<
        "customType",
        string,
        {
          customType: {
            options: {
              test: string;
            };
          };
        }
      >
    >
  >({
    // @ts-expect-error
    invalidType: ({ schema, data, fieldName, value, options }) => null,
  });
  expectType<
    FieldAdditionalValidators<
      "text" | "customType",
      string,
      FormFieldsSchemas<
        "customType",
        string,
        {
          customType: {
            options: {
              test: string;
            };
          };
        }
      >
    >
  >({
    // @ts-expect-error
    customType: ({ schema, data, fieldName, value, options }) =>
      options.invalidOption === "value" ? null : null,
  });
  expectType<
    FieldAdditionalValidators<
      "text" | "customType",
      string,
      FormFieldsSchemas<
        "customType",
        string,
        {
          customType: {
            options: {
              test: string;
            };
          };
        }
      >
    >
  >({
    // @ts-expect-error
    customType: ({ schema, data, fieldName, value, options }) =>
      options.role === 22 ? null : null,
  });
  expectType<
    FieldAdditionalValidators<
      "text" | "customType",
      "a" | "b",
      FormFieldsSchemas<
        "customType",
        "a" | "b",
        {
          customType: {
            options: {
              test: string;
            };
          };
        }
      >
    >
  >({
    // @ts-expect-error
    customType: ({ schema, data, fieldName, value, options }) =>
      options.test === "test" ? { path: ["text"], message: "c" } : null,
  });
});

test("Type FieldServerValidators works properly", () => {
  // Valid variants

  // check if type allows adding validation func for supported fields
  // check if this func has access to expected options and can return expected outcome
  expectType<FieldServerValidators<"text" | "password", string>>({
    text: ({ schema, data, fieldName, value, options }) => null,
  });
  expectType<FieldServerValidators<"text" | "password", string>>({
    text: ({ schema, data, fieldName, value, options }) =>
      options.placeholder === "" ? null : null,
    password: ({ schema, data, fieldName, value, options }) =>
      options.role === "passwordRepeat"
        ? {
            path: ["text"],
            message: "Error",
          }
        : null,
  });
  expectType<
    FieldServerValidators<
      "text" | "customType",
      string,
      FormFieldsSchemas<
        "customType",
        string,
        {
          customType: {
            options: {
              test: string;
            };
          };
        }
      >
    >
  >({
    text: ({ schema, data, fieldName, value, options }) => null,
    customType: ({ schema, data, fieldName, value, options }) =>
      options.test
        ? null
        : {
            path: ["customType", "text"],
            message: "test",
          },
  });
  expectType<
    FieldServerValidators<
      "text" | "customType",
      "a" | "b",
      FormFieldsSchemas<
        "customType",
        "a" | "b",
        {
          customType: {
            options: {
              test: string;
            };
          };
        }
      >
    >
  >({
    text: ({ schema, data, fieldName, value, options }) => null,
    customType: ({ schema, data, fieldName, value, options }) =>
      options.test
        ? null
        : {
            path: ["customType", "text"],
            message: "a",
          },
  });

  // Invalid variants

  // check if TS will warn us while trying to use unsupported fields or use them incorrectly
  expectType<FieldServerValidators<"text" | "password", string>>({
    // @ts-expect-error
    invalidType: ({ schema, data, fieldName, value, options }) => null,
  });
  expectType<FieldServerValidators<"text" | "password", string>>({
    // @ts-expect-error
    text: ({ schema, data, fieldName, value, options }) =>
      options.invalidOption === "value" ? null : null,
  });
  expectType<FieldServerValidators<"text" | "password", string>>({
    // @ts-expect-error
    text: ({ schema, data, fieldName, value, options }) =>
      options.role === 22 ? null : null,
  });
  expectType<FieldServerValidators<"text" | "password", string>>({
    // @ts-expect-error
    text: ({ schema, data, fieldName, value, options }) => ({
      path: ["invalidType"],
      message: "test",
    }),
  });
  expectType<
    FieldServerValidators<
      "text" | "customType",
      string,
      FormFieldsSchemas<
        "customType",
        string,
        {
          customType: {
            options: {
              test: string;
            };
          };
        }
      >
    >
  >({
    // @ts-expect-error
    invalidType: ({ schema, data, fieldName, value, options }) => null,
  });
  expectType<
    FieldServerValidators<
      "text" | "customType",
      string,
      FormFieldsSchemas<
        "customType",
        string,
        {
          customType: {
            options: {
              test: string;
            };
          };
        }
      >
    >
  >({
    // @ts-expect-error
    customType: ({ schema, data, fieldName, value, options }) =>
      options.invalidOption === "value" ? null : null,
  });
  expectType<
    FieldServerValidators<
      "text" | "customType",
      string,
      FormFieldsSchemas<
        "customType",
        string,
        {
          customType: {
            options: {
              test: string;
            };
          };
        }
      >
    >
  >({
    // @ts-expect-error
    customType: ({ schema, data, fieldName, value, options }) =>
      options.role === 22 ? null : null,
  });
  expectType<
    FieldServerValidators<
      "text" | "customType",
      "a" | "b",
      FormFieldsSchemas<
        "customType",
        "a" | "b",
        {
          customType: {
            options: {
              test: string;
            };
          };
        }
      >
    >
  >({
    // @ts-expect-error
    customType: ({ schema, data, fieldName, value, options }) =>
      options.test === "test" ? { path: ["text"], message: "c" } : null,
  });
});

test("Type ValidatedFormFieldsComponentsObj work properly", () => {
  // check if we can set only components for existing types and we are required to do it

  const exampleSchema = {
    test: {
      label: "test",
      type: "text",
      validation: z.string(),
    },
    testTwo: {
      label: "test",
      type: "password",
      validation: z.string(),
    },
  } satisfies BaseFormFieldsSchema<string>;

  expectType<ValidatedFormFieldsComponentsObj<typeof exampleSchema>>({
    test: ({ className }) => null,
    testTwo: ({ className }) => null,
  });

  // @ts-expect-error
  expectType<ValidatedFormFieldsComponentsObj<typeof exampleSchema>>({
    test: ({ className }) => null,
  });

  expectType<ValidatedFormFieldsComponentsObj<typeof exampleSchema>>({
    test: ({ className }) => null,
    // @ts-expect-error
    invalidType: ({ className }) => null,
  });

  expectType<ValidatedFormFieldsComponentsObj<typeof exampleSchema>>({
    // @ts-expect-error
    invalidType: ({ className }) => null,
  });
});
