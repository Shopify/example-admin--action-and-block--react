# Shopify app tutorial with admin extensions

This app is a guide for adding extensions to a Shopify app.

Rather than cloning this repo, you can use your preferred package manager and the Shopify CLI with [these steps](https://shopify.dev/docs/apps/getting-started/create) to create your own app and these [tutorials](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks) to get started with admin action and block extensions.

This repo tracks the four-part tutorial series that covers:

- [Building an admin action extension](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-action)
- [Building an admin block extension](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-block)
- [Connecting the action and block extensions](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/connect-action-and-block)
- [Connecting an extension to your app's backend](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/connect-extension-and-backend)

## Aligning this app to the tutorial

Running this app with no changes, will start you at the finishing point of [Building an admin block extension](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-block). This is the point where we have created an action and a block extension, but they are not yet connected to each other or fetching data from a backend. If you would like to run the app and extensions in another state, you will need to make some small adjustments in the configuration.

### Connected extensions

To run the extensions in the state that they are in at the finishing point of [Connecting the action and block extensions](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/connect-action-and-block), change the module path value in `extensions/issue-tracker-action/shopify.extension.toml` to `./src/ActionExtension-connect.jsx`.

```diff
-module = "./src/ActionExtension.jsx"
+module = "./src/ActionExtension-connect.jsx"
```

Additionally, change the module path value in `extensions/issue-tracker-block/shopify.extension.toml` to `./src/BlockExtension-connect.jsx`.

```diff
-module = "./src/BlockExtension.jsx"
+module = "./src/BlockExtension-connect.jsx"
```

### Connected to the app's backend

To run the extensions in the state that they are in at the finishing point of [Connecting an extension to your app's backend](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/connect-extension-and-backend), change the module path value in `extensions/issue-tracker-action/shopify.extension.toml` to `./src/ActionExtension-backend.jsx`.

```diff
-module = "./src/ActionExtension.jsx"
+module = "./src/ActionExtension-backend.jsx"
```

## A note on the comments

You will find magic comments, (eg. `# [START action-extension.configuration]`) throughout the files in this app. These are for highlighting code in shopify.dev and can be ignored.

## Quick start

### Prerequisites

1. You must [download and install Node.js](https://nodejs.org/en/download/) if you don't already have it.
2. You must [create a Shopify partner account](https://partners.shopify.com/signup) if you don’t have one.
3. You must create a store for testing if you don't have one, either a [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or a [Shopify Plus sandbox store](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store).

### Setup

If you used the CLI to create the template, you can skip this section.

Using yarn:

```shell
yarn install
```

Using npm:

```shell
npm install
```

Using pnpm:

```shell
pnpm install
```

### Local Development

Using yarn:

```shell
yarn dev
```

Using npm:

```shell
npm run dev
```

Using pnpm:

```shell
pnpm run dev
```

Press P to open the URL to your app. Once you click install, you can start development.

Local development is powered by [the Shopify CLI](https://shopify.dev/docs/apps/tools/cli). It logs into your partners account, connects to an app, provides environment variables, updates remote config, creates a tunnel and provides commands to generate extensions.

## More about the app

For more information about the base Remix app without extensions, check out this [repo](https://github.com/Shopify/shopify-app-template-remix).

## Resources

- [Remix Docs](https://remix.run/docs/en/v1)
- [Shopify App Remix](https://shopify.dev/docs/api/shopify-app-remix)
- [Introduction to Shopify apps](https://shopify.dev/docs/apps/getting-started)
- [App authentication](https://shopify.dev/docs/apps/auth)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [App extensions](https://shopify.dev/docs/apps/app-extensions/list)
- [Shopify Functions](https://shopify.dev/docs/api/functions)
- [Getting started with internationalizing your app](https://shopify.dev/docs/apps/best-practices/internationalization/getting-started)
