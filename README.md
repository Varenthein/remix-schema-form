# NodeJS GetResponse API wrapper

Simple wrapper for making type-safety fetch requests to GetResponse API v3. 

## About 

This package provides you a class with a set of methods to easily communicate with GetResponse API. It's built in TypeScript to help you both with requests and responses. 

When making a request, TS makes sure data you want to provide is in the proper format.
When using response, it makes sure you try to use fields that are indeed available and hints you on available data.

It's built upon the official docs: [https://apidocs.getresponse.com/v3](you can check it here).

> [!NOTE]  
> The package is not ready yet and is not currently published on npmjs.com.
> If you are interested, don't hesitate to follow the project to get informed when it's ready.

## Installation

You can install it using any package manager.

```
npm install --save-dev get-response-api-wrapper
```

```
yarn add --save-dev get-response-api-wrapper
```

```
pnpm add --save-dev get-response-api-wrapper
```

## Usage

You can start using the package by initializing new instance of the `GetResponse` class.
In the constructor, you need to provide working Get Response API key of your profile.

[https://www.getresponse.com/help/where-do-i-find-the-api-key.html](Where can I find it?)

```js
import { GetResponse } from "get-response-api-wrapper";

const gr = new GetResponse("my-secret-api-key");
```

> [!WARNING]  
> You shouldn't store API key directly in the app code!
> You should store as env variable instead.

Then you can simply use instance methods to communicate with GetResponse API.

## Methods

TO DO

## Bugs and feature requests

If you spot a bug or would love to see some new feature in the package, do not hesitate to fill an issue. 
Thanks!


