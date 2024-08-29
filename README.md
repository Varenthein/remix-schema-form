# Remix Schema Form

Create advanced forms with proper type-safety and client/server validation automatically simply by defining a schema.

## About

This package is a handy wrapper for React Hook Form and Remix Hook Form that lets you create advanced forms safely by only defining the desired data schema. We describe what fields we need, what type of data we expect, and where to output it... and that's all! The package takes care of rendering the form properly, validating data (both client and server-side!), showing errors, handling files, and makes sure that when the data reaches the action, we can safely use it.

The package gives you a lot out of the box, but lets you customize it quite heavily. We can add our own custom field types, additional validation for both client and server-side, custom file upload handlers, and so on. We can also take over the rendering process and decide where to put each form field or make them render conditionally, which may be handy for more sophisticated forms.

It also offers simple integration with any UI and internalization libraries to make sure that the rendered form uses our components properly and that labels, descriptions, or errors are indeed translated.

## Key Features

1. Automatic rendering of the form based on the given schema and UI components
2. Out of the box client/server validation (based on Zod + Remix-hook-form)
3. Maximum type-safety – get safe TS hints for data received in actions
4. Ready to use zod helpers for most used form field types (text, number, file, date, etc.)
5. Support for intl libraries

## Remix-schema-form vs Remix-forms

Both packages share a lot of similarities. After all, they aim to provide the same goal – automatic form rendering and easy (type-safety) client-server validation. What differs is the implementation.

Firstly, Remix-forms treats schema as a simple Zod object, whereas this package uses it as the main place for whole form fields configuration. We can easily define not only validation itself but also decide on more UI-focused stuff (like label, description, field options, required flag, and so on) and even condition some fields based on the value of others. All of these can be set just right up from the start in the schema object, whereas Remix-forms offers this only at the component level.

Secondly, Remix-schema-form offers easier UI components integration. While Remix-forms offers using custom UI components for the fields, we have to directly use them in the component render function or standard HTML input will be used. It heavily impacts the auto-generated feature, which cannot be simply used in that scenario without creating a custom wrapper for it. In our package, we aim to make the user decide upfront about what component should be used for each field type. It is more requiring, but after the basic setup, the user can create forms however they like, and the package will use proper components automatically.

At last, both packages try to provide the user with some customization capabilities. However, Remix-forms offers a little more in this matter. Remix-schema-form provides an easier plug-and-play experience, but it makes it also a little harder to extend it if we want really much more than what the app proposes. When you choose, it's worth considering it. If you want to start quickly and have a lot of options out of the box, this package can be a really good choice. If you plan to extend its core functionalities a lot, Remix-forms might be a better fit, and I personally think it is really well thought out (kudos to @danielweinmann).

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

In the most basic scenario, we can use the package straight up in the route file we want to use in our form.

```js
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


We start by defining the schema. We decide what fields (and what type) we need and how the app should validate it. At default, we can use only basic fields (look them up here), but we can easily create custom ones. Type is important as it determines what React component to use when rendering the specific field. Also, it determines additional options that can be provided to it. Regarding validation, we've used some built-in helpers here (zod helpers), but we could create zod rules ourselves as well.

In the component section, we simply render `ValidatedFormBase`. There are only two props that are required. `schema` which tells the component what fields to render and `submitActionName` which decides about the submit button content. And... that's all! If we don't provide UI components and error messages, the package will use default ones. They are very simple and we would probably want to change them for custom ones, but... it will work! Optionally we can also import some basic styles `import "remix-schema-form/dist/index.css";`. In our example we also included `mode` and `successMessage` prop. `mode` decides when to validate the form (defaults to `onSubmit`), `successMessage` will be shown when... form submit is a success (action returned `{ success: true }`).

And that's all! The package will render our form automatically and make sure to follow our schema and add proper validation.

But that's for the client-side. What about the server-side? After the submit, data will be validated again (thanks to the `getFormDataBase` func). You can be sure, that if `error` is null, the data is present, safe, and exactly in the shape we wanted.

And what is the best here, TS is carefully watching us all the time! At schema creation time, it makes sure we use a field type that exists and properly describes the expected data (e.g. validation and label are required). At the server-side it will properly hint us about the data types. For instance, if there is no error and `accept` is required, TS will inform us that it's surely `true`. No boolean, just `true`. As for `File`... well, it's not required, so TS will hint us about `File` or `undefined` type. Cool, right?

And if you wonder, how it is possible that file upload already works, the answer is simple – because the package has a default file upload handler. It's very basic and simply uploads files to "/public/uploads" folder. You would probably want to use something more advanced, but... it works out of the box. If you need something quick and simple or use the package as the prototype, these all default stuff make it very handy.

## Custom components

Defaults are nice, but of course, we rather rarely could stop with them. We need custom special fields, translated errors, additional validation, custom components, and much much more personalization. And here comes the beauty of this package. We can easily customize it to fill our needs.

Let's start with custom components and get rid of these ugly defaults.

TO DO

## Custom fields

To DO

## Internalization

TO DO

## Additional validation

TO DO

## Server validation

TO DO

## Custom errors

TO DO

## Customized fields rendering

TO DO

## Bugs and feature requests

If you spot a bug or would love to see some new feature in the package, do not hesitate to fill an issue.

Thanks!
