import {CmdScriptConfig} from './types'
import {cl, findOption, parseArgs} from './utils'

export class CmdScriptManager {
  private _config: { commands: CmdScriptConfig[] }

  constructor(config: {
    commands: CmdScriptConfig[]
  }) {
    this._config = config
  }

  performCommand(argv: string[] = process.argv.slice(2)) {
    const {args, params, invalidSyntax} = parseArgs(argv)

    if (invalidSyntax) {
      cl(`Bad command syntax! Try using: ${args.join(' ')} ${Object.entries(params).map(([key, value]) => `--${key}=${value}`).join(' ')}`)
    } else {
      if (!findOption(args, args, {
        children: this._config.commands.filter(value => value.command !== 'help'),
      } as any, params)) {
        cl('Invalid command. Use "help" to display a list of available commands.')
      }
    }
  }
}