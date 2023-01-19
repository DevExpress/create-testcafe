# create-testcafe

Use `create-testcafe` to initialize a new TestCafe project, or *add* TestCafe to an existing Node.js project.

![create-testcafe in action](/images/wizard.gif)

* [Launch commands](#launch-commands)
* [Specify project name and location](#specify-project-name-and-location)
* [Options](#options)
* [Forward options to npm init](#forward-options-to-npm-init)
* [Run the development version of `create-testcafe`](#run-the-development-version-of-create-testcafe)

## Launch commands

```sh
# npx
npx create-testcafe
# npm
npm init testcafe@latest
# yarn
yarn create testcafe
# pnpm
pnpm create testcafe
```

## Specify project name and location

To specify the name and location of the target folder, pass a valid path (relative or absolute) to the `create-testcafe` command:

```sh
# npx
npx create-testcafe appName
# npm 
# Preface the argument with a double dash
npm init testcafe@latest -- appName
# yarn
yarn create testcafe appName
# pnpm
pnpm create testcafe appName
```

## Options

The `npm init` command handles options differently from other launch commands. See the [forward options to npm init](#forward-options-to-npm-init) section for more information.

| Option  | Description | Value | Default value 
| ------------- | ------------- | ------------- | ------------- |
| --run-wizard, -w | Launch the interactive wizard | Boolean  | `true` if the target folder is a Node.js project |
| --template  | Project template  |`javascript` or `typescript` | `typescript` if the project directory includes a `.tsconfig.json` file. |
| --test-folder  | Test subfolder path | Valid relative path | `test`|
| --include-sample-tests  | Add sample tests to the project | Boolean | `true`|
| --github-actions-init  | Add a GitHub Actions workflow file to the project | Boolean | `true`|

## Forward options to npm init

The `npm init` command handles options and arguments differently from other launch commands. 

If you run Windows, preface the folder location argument with a double dash. If you run macOS, you can omit the dash.

```sh
# Windows
npm init testcafe@latest -- appName

# *nix
npm init testcafe@latest appName
```

Both **Windows** and **macOS** users need to preface other options with a double dash.

```sh
# Windows
npm init testcafe@latest -- appName -- --template typescript -- --test-folder functional

# *nix
npm init testcafe@latest appName -- --template typescript -- --test-folder functional
```

If you *omit* the folder location argument **on Windows**, add an **extra** double dash to the command string:

```sh
npm init testcafe@latest -- -- --template typescript -- --test-folder functional
```

## Run the development version of `create-testcafe`

To run the development version of `create-testcafe`, clone the GitHub repository and [build](#build-from-source) the project from source.

When the build is complete, you can run `create-testcafe` [with the `node` command](#run-create-testcafe-with-the-node-command), or [install the development version as a package](#install-as-a-package).

### Build the project from source

```sh
npm i

npm run fast-build
```

### Run `create-testcafe` with the node command

[Build](#build-the-project-from-source) the project and execute the following command:

```sh
node dist/bin.js ...args
```

### Install as a package

Follow the instructions in the [build](#build-the-project-from-source) section before you install the package.

```sh
npm i -g

create-testcafe ...args
```
