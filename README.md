# DEPRECATED
The TestCafe team no longer maintains the `create-testcafe` repository. If you want to take over the project, we'll be happy to hand it over. To contact the team, create a new GitHub issue or email support@devexpress.com.

## create-testcafe

Use `create-testcafe` to initialize a new TestCafe project, or *add* TestCafe to an existing Node.js project.

![create-testcafe in action](/images/wizard.gif)

* [Launch commands](#launch-commands)
* [Specify project name and location](#specify-project-name-and-location)
* [Options](#options)
* [Use npm init](#use-npm-init)
* [Run the development version of `create-testcafe`](#run-the-development-version-of-create-testcafe)

### Launch commands

```sh
# npx
npx create-testcafe
# yarn
yarn create testcafe
# pnpm
pnpm create testcafe
```

See the [use npm init](#use-npm-init) section for information on `npm init` support.

### Specify project name and location

To specify the name and location of the target folder, pass a valid path (relative or absolute) to the `create-testcafe` command:

```sh
# npx
npx create-testcafe appName
# yarn
yarn create testcafe appName
# pnpm
pnpm create testcafe appName
```

### Options

The `npm init` command handles options differently from other launch commands. See the [use npm init](#use-npm-init) section for more information.

| Option  | Description | Value | Default value 
| ------------- | ------------- | ------------- | ------------- |
| --run-wizard, -w | Launch the interactive wizard | Boolean  | `true` if the target folder is a Node.js project |
| --template  | Project template  |`javascript` or `typescript` | `typescript` if the project directory includes a `.tsconfig.json` file. |
| --test-folder  | Test subfolder path | Valid relative path | `test`|
| --include-sample-tests  | Add sample tests to the project | Boolean | `true`|
| --github-actions-init  | Add a GitHub Actions workflow file to the project | Boolean | `true`|

### Use npm init

You can launch `create-testcafe` with `npm init`:

```sh
npm init testcafe@latest
```

The `npm init` command handles options and arguments differently from other launch commands. The precise syntax of `npm init` depends on your Node.js version. We strongly recommend you use the **npx** command to pass additional parameters.

### Run the development version of `create-testcafe`

To run the development version of `create-testcafe`, clone the GitHub repository and [build](#build-from-source) the project from source.

When the build is complete, you can run `create-testcafe` [with the `node` command](#run-create-testcafe-with-the-node-command), or [install the development version as a package](#install-as-a-package).

#### Build the project from source

```sh
npm i

npm run fast-build
```

#### Run `create-testcafe` with the node command

[Build](#build-the-project-from-source) the project and execute the following command:

```sh
node dist/bin.js ...args
```

#### Install as a package

Follow the instructions in the [build](#build-the-project-from-source) section before you install the package.

```sh
npm i -g

create-testcafe ...args
```
