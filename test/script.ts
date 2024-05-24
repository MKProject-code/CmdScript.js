import {CmdScriptManager} from '../dist'

//npm run test schema create -- --test="\"val"
//npm run testcs schema create -- --test="\"val"

const cmdManager = new CmdScriptManager({
  commands: [
    {
      command: 'schema',
      description: 'Operations on the database schema.',
      // execute: (params) => {
      //   console.log('Schema!', params)
      // },
      children: [
        {
          command: 'create',
          description: 'Create missing arrays in the database.',
          execute: (params) => {
            console.log('Created!', params)
          },
          // children: [ /* there may be more children here :) */ ]
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

cmdManager.performCommand()
cmdManager.performCommand(['schema', 'update', '--test=Yes!'])