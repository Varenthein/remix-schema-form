# Remix Schema Form

Create advanced forms with maximum type-safety and client/server validation automatically by simply defining a schema.

## About

This package is a handy wrapper for React Hook Form and Remix Hook Form that lets you create advanced forms safely by only defining the desired data schema. We describe what fields we need, what type of data we expect, and where to output it... and that's all! The package takes care of rendering the form properly, validating data (both client and server-side!), showing errors, handling files, and makes sure that when the data reaches the server-side, we can safely use it.

There is a lot out of the box, but you can customize it quite heavily. We can add our own custom field types, additional validation for both client and server-side, custom file upload handlers or even take over the rendering process, so we can decide where to put each form field or make them render conditionally. It allows us to use it even for very sophisticated forms.

It's built in easy-integration in mind, so it works great with any UI and internalization libraries. Do you use NextUI, ShadCN or XYZUI? No problem! Do you have any translations type that is union of possible lang keys? No problem. Give it to the package and it will make sure that the rendered that all labels, descriptions, or errors are indeed translated. It as simple as that!

## Key Features

1. Automatic rendering of the form based on the given schema and UI components
2. Out of the box client/server validation (based on Zod + Remix-hook-form)
3. Maximum type-safety – always know what to expect
4. Ready to use zod helpers for most used form field types (text, number, file, date, etc.)
5. Support for intl libraries
6. Easy customization

## Remix-schema-form vs Remix-forms

You may think that this package is a bit like Remix-forms and indeed it is.
Both packages share a lot of similarities. After all, they aim to provide the same goal – automatic form rendering and easy (type-safety) client-server validation. However this is my personal take on that matter, based on my own experiences. What mainly differs is the implementation.

Firstly, Remix-forms treats schema as a simple Zod object, whereas this package uses it as the main place for whole form fields configuration. We can easily define not only validation itself but also decide on more UI-focused stuff (like label, description, field options, required flag) and even condition some fields based on the value of others. All of these can be set just right up from the start in the schema object, whereas Remix-forms offers this only at the component level.

Secondly, Remix-schema-form offers easier UI components integration. While Remix-forms offers using custom UI components for the fields, we have to directly use them in the component render function or standard HTML input will be used. It heavily impacts the auto-generated feature, which cannot be simply used in that scenario without creating a custom wrapper. In our package, we aim to make the user decide upfront about what component should be used for each field type. It is more requiring, but after the basic setup, the user can create forms however they like, and the package will use proper components automatically.

At last, both packages try to provide the user with some customization capabilities. However, Remix-forms offers a little more in this matter. Remix-schema-form provides an easier plug-and-play experience, but it makes it also a little harder to extend it if we want we want go really far beyond what the author prepared.

So what to choose? It depends. If you want to start quickly and have a lot of options out of the box, this package can be a really good choice. If you plan to extend its core functionalities a lot, Remix-forms might be a better fit. And what's better for production grade apps? If you want something production-ready, Remix-forms can be (for now!) a better choice. After all it's already in use for a while and we can see it as more battle-tested.

## Installation

You can install it using any package manager.

```		
npm install --save-dev remix-schema-form
```

```	
yarn add --save-dev remix-schema-form
```

```	
pnpm install --save-dev remix-schema-form
```

## Basic usage

In the most basic scenario, we can use the package straight up in the route file where we set up our form.

```ts
import type { ActionFunctionArgs } from "@remix-run/node";
import type { BaseFormFieldsSchema } from "remix-schema-form";
import { ValidatedFormBase, zCheckbox, zFile, zText } from "remix-schema-form";
import "remix-schema-form/dist/index.css";
import { getFormDataBase } from "remix-schema-form/server"

export const schema = {
  firstName: {
    type: "text",
    label: "First name",
    validation: zText({ min: 2, max: 20 })
  },
  lastName: {
    type: "password",
    label: "Last name",
    validation: zText({ min: 2, max: 20 })
  },
  avatar: {
    type: "file",
    label: "First name",
    validation: zFile({
      maxSize: 50 * 1024 * 1024,
      accept: ["image/png", "image/jpg", "image/jpeg"]
    })
  },
  accept: {
    type: "checkbox",
    label: "Terms of use",
    description: "You have to accept our terms of use",
    validation: zCheckbox({ required: true })
  }
} satisfies BaseFormFieldsSchema;

export const action = async ({ request }: ActionFunctionArgs) => {
  const { data, error } = await getFormDataBase(request, schema);
  if (error)
    return error;
  else
    console.log(data); // safe and typed data!

  return { success: true };

}
export default function Index() {
  return (
    <ValidatedFormBase
      mode="onChange"
      schema={schema}
      successMessage="Success!"
      submitActionName="Submit"
    />
  );
}
```


We start by defining the schema. We decide what fields (and what type) we need and how the app should validate it. At default, we can use only basic fields (link TODO), but we can easily create custom ones. Type is very important. Firstly, it determines what React component to use when rendering the specific field. Secondly, it determines additional options that can be provided to it. After all, there will be other possible options for text field type and different dates, right? Regarding validation, we've used some built-in helpers here (zod helpers list TODO), but we could create zod rules ourselves as well.

In the component section, we do only one thing – render `ValidatedFormBase`. It's role is to render our form based on the schema object we've provided. There are only two props that are required. `schema` which tells the component what fields to render and `submitActionName` which decides about the submit button content. And... that's all! If we don't provide UI components and error messages, the package will use default ones. They are very simple and we would probably want to change them for custom ones, but... it will work!

Optionally, if we use default components, we can also import some basic styles `import "remix-schema-form/dist/index.css";`. It's nothing fancy, but at least there will be some styling.

In our example we also included `mode` and `successMessage` prop. `mode` decides when to validate the form (defaults to `onSubmit`), `successMessage` will be shown when form submit is a success (action returned `{ success: true }`).

Here you can check all available props – link TODO.

And that's all! The package will now render our form automatically and make sure to follow our schema and add proper validation.

But that's for the client-side. What about the server-side? After the submit, data will be validated again (thanks to the `getFormDataBase` func). You can be sure, that if `error` is null, the data is present, safe, and exactly in the shape we wanted.

And what is the best here, TS is carefully watching us all the time! At schema creation time, it makes sure we use a field type that exists and properly describe the expected data (e.g. validation and label are required). At the server-side it will properly hint us about the data types. For instance, if there is no error and `accept` is required, TS will inform us that it's surely `true`. No boolean, just `true`. As for `File`... well, it's not required, so TS will hint us about `File` or `undefined` type. Cool, right?

And if there was an error and we return it, client-side will pick it up and render it automatically!

> [!NOTE]  
> You can wonder, how it is possible that file upload already works. The answer is simple – because the package has a default file upload handler. It's very basic and simply uploads files to "/public/uploads" folder giving them unique names. You would probably want to use something more advanced, but... it works out of the box. If you need something quick and simple or it in the prototype app, these all default stuff make it very handy.

## Custom components

Defaults are nice, but of course, they are rarely enough. We need custom special fields, translated errors, additional validation, custom components, and much much more customization.

Let's start with custom components and get rid of these ugly defaults.

The package lets us define component for each supported field type and two special ones – for button and alerts. We can do this by providing `components` object prop to `ValidatedFormBase`. 

Thankfully there is no much work to do and we can easily integrate UI components from any chosen library.

Form field components are always rendered with at least props below:
- label: `string` (defaults to empty string)
- description: `string` (defaults to empty string)
- error: `string` or `null`
- required: `boolean`
- disabled: `boolean`
- control
- fieldName 
- register

`label`, `description`, `required` or `disabled` are simply picked up from the schema and can be used by component to properly describe and style the field.

`error` is, of course, error message than will be present if validation fails.

The most important ones are `fieldName` and `register` field. As our package relies on remix-hook-form our form fields have to be properly registered with `register` func. **And this the only requirement for our components –  they have to register our field**. Using the rest of props is encouraged (we should at least render error message), but technically not necessary.

`control` is completely optional, but it gives you remix-hook-form data that you can use if you wish.

Often we will also have one more prop to use – `options`. Some of the field types allows for additional options, like "placeholder", "type", "minDate" and so on. If this info is set in schema, `options` prop will have this information stored. E.g. if `text` type field allows for "placeholder" in schema, here we will be able to access it.

Ok. Less talking, more coding.

Let's create new file, called `formComponents.tsx`. We will define our components here.

Inside create an object and type it as `ValidatedFormBaseComponents`. This type will make sure we've choosen component for every field type and button/alert ones. It will also hint us, what can we expect when it comes to props. It will be very handy especially with `options` prop that can be different for various field types.

```ts
// formComponents.tsx
import type { ValidatedFormComponents } from "remix-schema-form";

export const formComponents: ValidatedFormComponents = {}
```

In the easiest scenario we can define very simple components.

Consider example `TextField` component that we could create to serve "text" type fields.

```ts
import { OptionsForBasicType } from "remix-schema-form";
import { DefaultFormFieldComponentBaseProps } from "remix-schema-form/src/utils/types";

export const TextField = ({
  label,
  description,
  options,
  error,
  fieldName,
  register,
  required,
  disabled,
}: DefaultFormFieldComponentBaseProps & {
  options?: OptionsForBasicType<"text">
}) => {
  return (
    <div>
      <label>
        <span>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </span>
        <input
          type={options?.role || "text"}
          placeholder={options?.placeholder || ""}
          style={error ? { border: "1px solid red" } : {}}
          disabled={disabled}
          required={required}
          {...register(fieldName)}
        />
        {description && <div>{description}</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </label>
    </div>
  );
};
```

Notice what props we expect. We use all the standard ones (`label`, `description` etc.) and one additional – `options`. Not every field has options prop, but `text` does. It allows for "role" ("text" | "email" | "search" | "tel" | "url") and string placeholder. You can read what basic fields support what options here (link TODO). We used `DefaultFormFieldComponentBaseProps` to get hints on default component props and `OptionsForBasicType` for text `type` to get also the hints on possible options for this specific field type.

The render part is quite self-explainatory. `{...register(fieldName)}` is the only "magic" part, but if you use react-hook-from at daily basis, it's nothing new. It makes the library aware of the field state.

When it's ready, we can simply use it in out components object.

```ts
export const formComponents: ValidatedFormComponents = {
  text: TextField,
  ...
}
```

It is recommended way, especially if we have a lot of custom fields, but we could also define the components directly here:

```ts
export const formComponents: ValidatedFormComponents = {
  text: ({
    label,
    description,
    options,
    error,
    fieldName,
    register,
    required,
    disabled
  }) => (
    <div>
      <label>
        <span>{label}</span>
        <input
          type={options?.role ?? "text"}
          placeholder={options?.placeholder ?? ""}
          style={error ? { border: "1px solid red" } : {}}
          disabled={disabled}
          required={required}
          {...register(fieldName)}
        />
        {description && <div>{description}</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </label>
    </div>
  )
  ...
}
```

This way, TS would hint us the props types automatically without needing to import `DefaultFormFieldComponentBaseProps` or `OptionsForBasicType`

Next components for the rest of the basic types would look really similar. The only thing that differs is an `options` prop and its structure.

Don't forget about two special components: button and alert! We have to take care of them.

Button component will receive:
– type: "button" | "submit" | "reset";
– isSubmitting?: boolean;
– children: React.ReactNode;

`children` for now is basically "submitAction" prop value that we provide to `ValidatedFormBase`. `type` is currently always the "submit" one (it can be expanded in the future). `isSubmitting` informs us if form is currently in submitting state and can be used for displaying some kind of spinner.

Alert component will receive:
- variant: `"error" | "success"`
- items: `string[]` (if error) | `undefined`
- children: React.ReactNode (if success)

`items` is present only at `error` variant and is simply array of errors messages.

Example:

```ts
submitBtn: (args) => (
    <button type={args.type}>
      { args.isSubmitting ? "Submitting..." : args.children}
    </button>
  ),
  message: ({ variant, items, children }) => {
    if (variant === "success")
      return (
        <div style={{ margin: "10px auto", maxWidth: "200px", padding: "10px", border: "2px solid green"}}>
          <h2>Success!</h2>
          {children}
        </div>
      )
    else
      return (
        <div style={{ margin: "10px auto", maxWidth: "200px", padding: "10px", border: "2px solid red"}}>
          <h2>Error!</h2>
          {items.join(", ")}
        </div>
      )
  }
```

After we define our components object, the only thing that left it to provide it to `ValidatedFormBase` as a prop.

```ts
<ValidatedFormBase
    mode="onChange"
    components={formComponents}
    schema={schema}
    successMessage="Success!"
    submitActionName="Submit"
/>
```

...and that's all! :)

As we said before, you use, of course, some kind of UI library and choose it's components instead.

Example? For NextUI library text input could look like this:

```ts
import { Input } from "@nextui-org/react";
import { OptionsForBasicType } from "remix-schema-form";
import { DefaultFormFieldComponentBaseProps } from "remix-schema-form/src/utils/types";
import { FormFieldComponentBaseProps } from "~/modules/core/forms/utils/types";

export const TextField = ({
  label,
  description,
  options,
  error,
  fieldName,
  register,
  required,
  disabled,
}: DefaultFormFieldComponentBaseProps & {
  options?: OptionsForBasicType<"text">
}) => {
  return (
    <Input
      className="max-w-xs"
      label={label}
      labelPlacement="outside"
      description={description}
      type={options?.role ?? "text"}
      placeholder={options?.placeholder ?? ""}
      isInvalid={!!error}
      isDisabled={disabled}
      errorMessage={error}
      isRequired={required}
      {...register(fieldName)}
    />
  )
}
```

## Custom field types

Remix-schema forms comes up with some pre-built field types.

There are:
- text
- password
- textarea
- select
- switch
- checkbox
- number
- file
- files
- date

That's quite a few, but often not enough. Therefore the package allows for adding our own.

How? Let's make an example field type together. Maybe for a color input.

Start by creating some kind of config file. 

```ts
//formsConfig.ts

import type { FormFieldsSchemas } from "remix-schema-form"

// Register custom field types
export type CustomSupportedFieldType = "color"

// Prepare schemas for custom field types
export type CustomFieldsSchemas = FormFieldsSchemas<CustomSupportedFieldType, string, {
  color: {
    options?: {
      picker?: boolean
    }
  },
}>
```

We need at least two types here: one that defines our custom field types names and second that decide what options do this fields support (if any).

In example above we define custom type "color" and decide that it supports boolean option picker. Let's say it will decide if we can use color picker or we have to type color name manually.

Of course, we can just leave `color` empty:

```ts
color: {},
```

This way, we would not support any options for these fields, but let's say we want to support it. What then?

Let's go back to our components file.

First we have to change our object type. For now it only hints us the basic components. In order to also support our custom ones we have to provide the `ValidatedFormComponent` type both custom field types names and schemas. 

```ts
export const formComponents: ValidatedFormComponents<Record<CustomSupportedFieldType, never>> = {
```
Thanks to that TS will be able to make sure that we determine components for custom fields as well and hints us about props they are receiving.

For instance, we can define our color form field component as follows:

```ts
  color: (args) => args.options?.picker
    ? <input type="color" />
    : <input type="text" />,
```

Ts will hints us that options are well... optional here, but what's more important, that picker is an boolean. How does it know this? Because it has access to structure we've defined before:

```ts
export type CustomFieldsSchemas = FormFieldsSchemas<CustomSupportedFieldType, string, {
  color: {
    options?: {
      picker?: boolean
    }
  },
}>
```

And that's it! Now when we can use our type in schema and the package will properly render it as `<input type="color" />`. But wait! There is one more thing. For now we were using `BaseFormFieldsSchema` as schema type. It doesn't know our custom fields. We have to change that.

Thankfully it will be really easy. `BaseFormFieldsSchema` is a generic type that takes two args. First informs about possible language keys and the second one can be our custom `FormFieldsSchema`. 

```ts
export const schema = {
  color: {
    type: "color",
    label: "Color",
    validation: z.string(),
    options: {
      picker: true
    }
  },
} satisfies BaseFormFieldsSchema<string, CustomFieldsSchemas>
```

We've used string as lang key union as we don't care about internalization in this example. The second arg is simply our custom fields schema, we've created before. Thanks to that TS knows that we can use field type "color" and it has options with picker boolean property.

And now that's really it! :) It works... It wasn't so hard, was it?

> [!NOTE]  
> Notice, that we haven't used any built-in helpers for validation. Well... It's because the package had it prepared only for basic fields and color is not of them. But that's good, because now you have a real example that we can use old school custom zod validation as well ;)

## Internalization

In modern worth we rarely focus only on one market. We try to diversify for different countries and that means we need to support different languages.

Remix-schema-form is built in internalization in mind and let's you quickly integrate any intl package you use.

When it comes to translations and forms, there are three aspect we have to areas we have to cover.

### Errors translations

First one are errors. The package at default returns only simple keys while validating. It should be a task for intl library to get it and transform into proper message in currently set language.

Therefore the package needs to have a translate func provided that it could use for translations. From simple keys like "invalidType" to real translation "Invalid type".

### Labels and messages

The second one are field labels, button contents are messages. For instance, when we set the labels in the schema and we can store only keys there. It's not part of component function or loader/action, so we don't have access to translation plugins after all. So it has to the `BaseValidatedForm` task to translate and render them. Therefore again – we need to provide translation function to the `BaseValidatedForm` component.

When it comes to messages or button label, we could technically translate them upfront as we provide their values as props anyway, but... who likes mixed patterns? Therefore for them, `BaseValidatedForm` also expects keys and take the translation process as it's own responsibility.

When we do not provide translation func, the package assume that there is no internalization and default translation func is used. It translated error keys to simple english messages (it works only zod helpers errors) and leave your own errors, labels and messages untranslated. So if you don't use internalization, you can safely ignore that there is some kind of default translation func beneath. You can just write zod errors or labels in plain english, like it's not even there.

### Type-safety

Some intl libs give you an union type that has all the available lang keys. That's great, because thanks to that you know if use the key that really exists. If you have such a type, you can provide it to the package and TS will give you hints while creating the schema or using the props in components.

### Example

It sounds nice, but how can we do this?

First of all, we need to provide `BaseValidatedForm` that follows expected structure – `(key: string, values?: Record<string, any>) => string`

The package doesn't care about inner implementation. It provides to the func key (error key, label key etc.), values (e.g. "max" for "tooLong" error) and expects that will receive translated string. How this function will prepare this string is up to you. 

For instance if you remix-i18n, this func could look like this:

```ts
const translateFunc = (
  key: string,
  values?: Record<string, any>
) => {
  return t(key, values)
}
```

When the function is ready, you have to provide it to `BaseValidatedForm` as prop and... that's all!

```ts
<ValidatedFormBase
  ...
  translateFunc={translateFunc}
/>
```

Now it will be used by the package to translate all the labels, errors and messages.

For instance, if one of our fields will have label "title", the final name in the form will be equal to result of `t("title")`.

> [!IMPORTANT]  
> Take a note, that when providing custom translate func, the default one is nto longer in use. Therefore, you have to cover all translations for basic errors that normally was handler by it.

Here are the lang keys that your intl library should properly translate:

```ts
{
  required: "Required",
  invalidFormData: "Something went wrong...",
  invalid: "Invalid value",
  tooLong: "Too long (max {{max}})",
  tooShort: "Too short (min {{min}})",
  tooBig: "Too big (max {{max}})",
  tooSmall: "Too small (min {{min}})",
  fileIsTooBig: "File is too big (max {{max}} MB)",
  unsupportedFormat: "Invalid format (accepted: {{formats}})",
  invalidDate: "Invalid date",
  dateTooEarly: "Date is too early (min: {{min}})",
  dateTooLate: "Date is too late (max: {{max}})",
  dateRangeInvalid: "Out of range",
  dateRangeNotEnd: "End date not found",
  nameAlreadyExists: "Already exists",
  passwordsDontMatch: "Passwords don't match",
  invalidEmail: "Invalid e-mail address",
  invalidPhone: "Invalid phone number",
  tooManyElements: "Too many elements (max: {{max}})",
  tooFewElements: "Too few elements (min: {{min}})",
}
```

Ok, translations should work just fine now. But what about hinting? For now, we can still write anything as the label or `submitAction` and TS doesn't complain. That's bad.

When it comes to the schema, we can easily fix that. We need to make only two changes.

First go to your `CustomFieldsSchemas` and swap `string` for your lang key union. 

For instance:

```ts
// Prepare schemas for custom field types
export type CustomFieldsSchemas = FormFieldsSchemas<CustomSupportedFieldType, "foo" | "bar", {
  color: {
    options?: {
      picker?: boolean
    }
  },
}>
```

Then change your schema type. `BaseFormFieldsSchema` is a generic type where first arg should be lang key union.

```ts
export const schema = {
  color: {
    type: "color",
    label: "Color",
    validation: z.string(),
    options: {
      picker: true
    }
  },
} satisfies BaseFormFieldsSchema<"foo" | "bar", CustomFieldsSchemas>
```

And that's all. Now TS will now that label **has to** be one of our lang keys.

Of course, we could provide the union type instead of writing the union directly and that would be more desired way.

Ok, that's enough for the schema, but what about `successMessage` and `submitActionName`. It seems that `BaseValidatedForm` still supports any string. That's right and there isn't ready way to just change that. But... We can easily create a wrapper for it that adds proper requirement. After all, we already set so many repeatable props for `BaseValidatedForm` that it would be worth to create some kind of wrapper anyway.

Just look at this:

```ts
const translateFunc = (
  key: string,
  values?: Record<string, any>
) => {
  ...
}

return (
  <ValidatedFormBase
    mode="onChange"
    translateFunc={translateFunc}
    components={formFieldComponents}
    schema={schema}
    successMessage="Success!"
    submitActionName="Submit"
  />
);
```

Do you want to repeat it over and over? Not really.

And if we are going to create `ValidatedFormBase` anyway, we can easily use that fact to make `successMessage` and `submitActionName` require proper lang key as well.

For example:

```ts
export const ValidatedForm = <Schema extends AnyFormFieldsSchema>({
  schema,
  submitActionName,
  successMessage,
}: {
  schema: Schema,
  successMessage: MyLangKeyUnion,
  submitActionName: MyLangKeyUnion
}) => {

  const translateFunc = (
    key: string,
    values?: Record<string, any>
  ) => {
    ...
  }
 
  return (
    <ValidatedFormBase
      mode="onChange"
      translateFunc={translateFunc}
      components={formComponents}
      schema={schema}
      successMessage={successMessage}
      submitActionName={submitActionName}
    />
  );
}
```

We have two pros here. Firstly, we can use our `ValidatedForm` much easier:

```ts
<ValidatedForm
  schema={schema}
  successMessage={"success"}
  submitActionName={"submit"}
/>
```

Secondly, TS will make sure that both `successMessage` and `submitActionName` are proper lang keys.

### Translated options

There is still one thing inside that we haven't covered yet and... it's quite important. When we defined lang key union type in `BaseFormFieldsSchema`, TS has automatically started to make sure our label,description and even options are using existing lang key. But we haven't talked about options enough. 

When it comes to `description` and `label`, these all should be always a lang keys. No matter if is basic field or custom one – TS is sure about that. But what about options? When options is string, should be it considered as lang key? Or not always? For basic fields, situation is already covered by the package. But what about custom fields? Well... TS never guesses. Therefore we have to inform it explicitly what options should be considered lang keys.

Thankfully, it's not that hard.

Firstly, we have to create the object that defines our needs using 
`OptionsTranslationConfigCustom` type.

For instance:

```ts
import type { FormFieldsSchemas, OptionsTranslationConfigCustom } from "remix-schema-form"

// Register custom field types
export type CustomSupportedFieldType = "color"

// Prepare schemas for custom field types
export type CustomFieldsSchemas = FormFieldsSchemas<CustomSupportedFieldType, "foo" | "bar", {
  color: {
    options?: {
      picker?: boolean
      someKindOfString: string
    }
  },
}>

// Custom fields options translations config
export const customFieldsTranslations: OptionsTranslationConfigCustom<
  CustomSupportedFieldType,
  CustomFieldsSchemas
> = {
  color: {
    someKindOfString: true
  }
}
```

`OptionsTranslationConfigCustom` makes sure we try to define options translations only for existing types and properties that are in fact strings. `true` on property key means simply "this options should be translated" by `ValidatedFormBase` translate function.

It covers even more advanced options structures (more on this here TODO).

Then we only have to provide this object `customFieldsTranslations`  to `ValidatedFormBase` as `customFieldsTranslationConfig` and... that's all. It's simple as that.

## Default values

We often use forms in edit pages. Therefore the package allows for setting default data for the fields. We can do that easily by simply providing `defaultValues` object prop to `ValidatedFormBase` where keys are field names and values are... well – default values.

## Additional validation

Sometimes there is need to add some additional validation that takes into account more than one field. Then zod `validation` property in the schema is not enough. After all it gives us the access only to the one specific field values.

Thankfully, we can easily add additional validation that has access to more than just one field.

All we have to do, is to create an object that defines it. We can save it forms config file.

```ts
// Custom additional validators for custom field types
// they run after standard validation passes
export const customAdditionalValidators: FieldAdditionalValidators<CustomSupportedFieldType, MyLangKey, CustomFieldsSchemas> = {
  color: ({ data, fieldName, options }) => {
    
    if (somethingIsWrong)
      return {
        message: `error|value=${someValue}`,
        path: [fieldName]
      }

    return null;
  }
}
```

First thing is to use proper type.

```ts
fieldAdditionalValidators<CustomSupportedFieldType, MyLangKey, CustomFieldsSchemas>
```

It takes our custom fields types, schemas and our lang key union, to make sure we can add additional validation only to fields that in fact exist and our validation func is properly typed.

`data` gives us access to all the fields. That's something we didn't have in single field validation. `fieldName` is simply fieldName. We have also `options` which gives us field options. There are also `value` and `schema` which you can easily figure out :)

Validation func can have any code inside, but it is important what it returns. It can return `null` which simply means "everything is okay" or error object. In this second scenario we should provide message (it should be proper lang key with any potential values gathered after `|` and split by `&`) and `path`. The `path` should be an array with field names we want to mark as "with error".

When the object is ready, we simply has to provide it as `customAdditionalValidators` prop to `ValidatedFormBase`.

> [!NOTE]  
> Additional validators run only when basic single field validators pass. It means that user will see potential errors generated by them only if he fixes basic ones first.

It is important to add custom validators on the server-side as well to provide equally strong validation on both ends. We can do this by providing the same validators object to `getFormDataBase`.

```ts
const { data, error } = await getFormDataBase(request, schema, {
  customAdditionalValidators
});
```

## Server validation

Sometimes we want to validate something that doesn't make much sense client-side, but is crucial on the back-end.

It's basically the same idea as custom additional validators, only with this change that it is provided only to `getFormDataBase` and not to `ValidatedFormBase`.

We create validators object with proper typing.


```ts

// Custom server validators for custom field types
// they run only server-side after standard validation passes
export const customServerValidators: FieldServerValidators<CustomSupportedFieldType, MyLangKey, CustomFieldsSchemas> = {
  color: ({ data, fieldName, options }) => {
    
    if (somethingIsWrong)
      return {
        message: `error|value=${someValue}`,
        path: [fieldName]
      }

    return null;
  }
}
```

And then provide it to `getFormDataBase`:

```ts
const { data, error } = await getFormDataBase(request, schema, {
  customAdditionalValidators,
  customServerValidators
});
```

That is basically it.

## Custom errors

Sometimes even after `getFormDataBase` we tend to do some additional stuff and when it fails, we want to return the error. In that scenario form is technically ok, so we don't got any error from `getFormDataBase`, but we want to return one. And often we want to assign it to specific fields.

Well, it is possible!

`getFormDataBase` in case of success, returns `createCustomError` func.

```ts
export const action = async ({ request }: ActionFunctionArgs) => {

  const { data, error, createCustomError } = await getFormDataBase(request, schema);
  if (error)
    return error
  else
    console.log(data);

  if (somethingIsWrong)
    return createCustomError({
      color: "message"
    })

  return { success: true };

}
```

It's very easy to use. We have to provide the object where `key` is fieldName we want assign the error to and the values is error message. We can also return root error by using "root" key. Then we will receive on the client-side global error with given message instead of field error.

```ts
 if (somethingIsWrong)
    return createCustomError({
      root: "message"
    })
```

## Conditionals fields

Sometimes we want to build forms with structure that reacts to user action. So some fields are only shown when other specific fields have specific values. For instance, show "seat chooser" field, only if client chooses more than 0 tickets.

You can wonder if it's possible when using autogenerated forms, but... it is! And it is quite simply. The only thing we have to do, is to inform the form how we want to condition them.

We can do that by defining simple object of type `SchemaConditionals<typeof schema>`.

```ts
export const schemaConditionals = {
  seatChooser: (data) => data.tickets > 0,
} satisfies SchemaConditionals<typeof schema>
```

We can define conditional func for each of the form fields. This func has access to current form data and it returns true -> the field will be visible and send to the server. If not -> it will be omitted.

So in our example above, we dimply define that `seatChooser` field should be visible only of current tickets amount is more than zero. Easy, right?

> [!TIP]
> We can also add special `__watch` key to the object, where we explicitly tell the form which form fields are used to define visibility of other. We don't have to do that, but it makes our form more performant.

```ts
export const schemaConditionals = {
  seatChooser: (data) => data.tickets > 0,
  __watch: ["tickets"]
} satisfies SchemaConditionals<typeof schema>
```

Here we inform the form, that only `tickets` field should be watched for other fields visibility update.

Of course, `schemaConditionals` should be provided both to client-side (as `schemaConditionals` prop in `ValidatedFormBase`) and server-side (as four arg to `getFormDataBase`).

## Customized fields rendering

Sometimes we want more freedom and autogenerated form doesn't really suits us. For instance, we want to split fields to columns or style the whole things in some sophisticated way.

We can do this by simply providing children func to the `ValidateFormBase`.

```ts
<ValidatedFormBase
  mode="onChange"
  translateFunc={translateFunc}
  components={formComponents}
  schema={schema}
  successMessage={successMessage}
  submitActionName={submitActionName}
>
  {({ Form, ...control }) => {
    <div>
      <Form.firstName {...control} />
      <Form.lastName {...control} className="test" />
    </div>
  }}
</ValidatedFormBase>
```

`Form` gives us access to all the fields in the form and we can render them anywhere we want. Using `control` is required as it makes sure that remix-hook-form still has an access to the form data.

> [!TIP]
> `ValidatedFormBase` doesn't hint us if we use existing fields.
> There is however built-in type `FormFieldsChildrenFunc<Schema>` that can provide proper hinting. If you use custom wrapper for `ValidatedFormBase` (which is the recommended way anyway), you can type the `children` with this typing.

## Bugs and feature requests

If you spot a bug or would love to see some new feature in the package, do not hesitate to fill an issue.

Thanks!
