import {CmdScriptConfig, CmdScriptParams} from './types'

export function cl(message: string) {
  console.log(` ${message}`)
}

export function clh(args: string[], message: string) {
  console.log(` ${args.join(' ')} - ${message}`)
}

export function parseArgs(args: string[]): {
  args: string[],
  params: CmdScriptParams,
  invalidSyntax: boolean
} {
  const params: { [key: string]: string } = {}

  const resultArgs: string[] = []

  let isParamFound = false
  let invalidSyntax = false
  args.forEach(arg => {
    const match = arg.match(/^--([^=]+)(?:=(.*))?$/)
    if (match) {
      isParamFound = true
      const key = match[1]
      const value = match[2] ?? null
      params[key] = value
    } else {
      if (isParamFound) {
        invalidSyntax = true
      }
      resultArgs.push(arg)
    }
  })

  return {
    args: resultArgs,
    params: params,
    invalidSyntax: invalidSyntax,
  }
}

export function findOption(argsAll: string[], argsRemaining: string[], cmdOptionParent: CmdScriptConfig, params: CmdScriptParams) {
  const argsRemainingNext = argsRemaining.slice(1)
  const argsCurrent: string[] = argsAll.filter(value => !argsRemainingNext.includes(value))

  if (argsRemaining.length === 1 && argsRemaining[0] === 'help') {
    if (cmdOptionParent.execute) {
      clh([...argsCurrent.slice(0, -1)], cmdOptionParent.description)
    }
    cmdOptionParent.children?.forEach(value => {
      if (value.children && value.children.length > 1) {
        if (value.execute) {
          clh([...argsCurrent.slice(0, -1), value.command, `[${['help', ...value.children.map(child => child.command)].join('|')}]`], value.description)
        } else {
          clh([...argsCurrent.slice(0, -1), value.command, `<${['help', ...value.children.map(child => child.command)].join('|')}>`], value.description)
        }
      } else {
        if (value.execute) {
          clh([...argsCurrent.slice(0, -1), value.command], value.description)
        }
      }
    })
    return true
  }
  const cmdOptionFound = cmdOptionParent.children?.find(value => value.command === argsRemaining[0])
  if (!cmdOptionFound) {
    return false
  }
  if (!findOption(argsAll, argsRemainingNext, cmdOptionFound, params)) {
    if (argsRemainingNext.length > 0) {
      cl(`Invalid command. Use "${argsCurrent.join(' ')} help" to display a list of available commands.`)
    } else {
      if (cmdOptionFound.execute) {
        cmdOptionFound.execute(params)
        // console.log('Executed!')
      } else {
        cl(`Invalid command. Use "${argsCurrent.join(' ')} help" to display a list of available commands.`)
      }
    }
    return true
  } else {
    return true
  }
}