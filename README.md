# create-testcafe

Use `create-testcafe` to initialize a new TestCafe project, or *add* TestCafe to an existing project.

* [Usage](#usage)
* [Options](#options)
* [How to manually test dev version](#how-to-manually-test-dev-version)

## Usage

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

## Options

The `create-testcafe` tool accepts the following options:

### run-wizard

If you enable the `--run-wizard` option, the `create-testcafe` tool will display an interactive wizard that allows you to specify project settings:

**Type**: Boolean

**Default value**: `true` unless the project directory already includes any project.

### template

The `--template` option determines the programming language for TestCafe tests.

**Possible values**:
* `javascript`
* `typesctipt`

**Default value**: `javascript` unless the project directory includes a `.tsconfig.json` file.

### test-folder

The `--test-folder` option specifies the relative path to the test subfolder.

**Possible values**: all valid relative paths

**Default value**: `tests`

### include-sample-tests

If you enable the `--include-sample-tests` option, the `create-testcafe` tool adds a sample test to the project's test folder.

**Type**: Boolean

**Default value**: `true`

### github-actions-init

If you enable the `--github-actions-init` option, the `create-testcafe` tool adds a YAML file with a simple GitHub Actions workflow to the project folder.

**Type**: Boolean

**Default value**: `true`

## How to manually test dev version

### Node
```sh
npm i

npm run fast-build

node dist/bin.js ...args
```

### With package installation
```sh
npm i

npm run fast-build

npm i -g

npx create-testcafe ...args
```
