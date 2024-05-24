# CmdScript.js

- Simple CLI command manager for NodeJS.
- Easily create your own commands for your NodeJS project!
- Ready for production.

## Install

```shell
# For NPM
npm install @mkproject-code/cmdscript.js

# For Yarn
yarn add @mkproject-code/cmdscript.js
```

## Requirements

If you want to run your script in TypeScript you need to install `ts-node`:

```shell
# For NPM
npm install --save-dev ts-node

# For Yarn
yarn add --dev ts-node
```

## Usage

```shell
cs <your_command> [your_subcommand] [your_subsubcommand] # and an infinite number of sub sub sub... commands

# example
cs my_command my_subcommand
# or you can use with parameters
cs my_command --param1=value --param2=value
# or
cs my_command --param1=value --param2="value is \"here\" :)"
```

### 1. Create your script file.

For example `script.ts`:

```ts
import {CmdScriptManager} from '@mkproject-code/cmdscript.js'

const cmdManager = new CmdScriptManager({
  commands: [
    {
      command: 'schema',
      description: 'Operations on the database schema.',
      children: [
        {
          command: 'create',
          description: 'Create missing arrays in the database.',
          execute: (params) => {
            console.log('Created!', params)
          },
          children: [ /* there may be more children here :) */ ]
        },
        {
          command: 'update',
          description: 'Create new or update existing tables in the database. This will also remove unused tables from the database!',
          execute: (params) => {
            console.log('Updated!', params)
          },
        },
      ],
    },
  ]
})

// by default it passes all arguments from the CLI (process.argv.slice(2))
cmdManager.performCommand()
// you can pass your own arguments, then only what you pass will be executed
cmdManager.performCommand(['schema','create'])
```

### 2. Specify the path to the script in `package.json`

Add `cmdscript`:

```json lines
{
  //...
  "cmdscript": "src/cmd/script.ts" // supports .js or .ts file
}
```

### 3. Run your commands

Type `cs` at the command line and enjoy the working script! :)

Example:

```shell
$ cs schema create --param1=some_value
Created! { param1: 'some_value' }
```