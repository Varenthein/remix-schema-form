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

		
npm install --save-dev remix-schema-form


		
yarn add --save-dev remix-schema-form


		
pnpm add --save-dev remix-schema-form


## Basic usage

TO DO

## Custom fields

TO DO

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
